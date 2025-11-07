require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const EMIPlan = require('../models/EMIPlan');
const connectDB = require('../config/database');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
  try {
    await connectDB();

    // Read data from JSON file
    const dataPath = path.join(__dirname, '../data/seedData.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Clear existing data
    await Product.deleteMany({});
    await EMIPlan.deleteMany({});

    // Helper function to calculate EMI
    const calculateEMI = (principal, rate, tenure) => {
      if (rate === 0) {
        return Math.round(principal / tenure);
      }
      const monthlyRate = rate / 100 / 12;
      const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
      return Math.round(emi);
    };

    const createdProducts = [];

    // Process each product from JSON file
    for (const productData of jsonData.products) {
      const { variants, ...productFields } = productData;
      
      // Process variants and create EMI plans for each
      const processedVariants = [];
      
      for (const variantData of variants) {
        const { emiPlans: emiPlansData, ...variantFields } = variantData;
        const variantEmiPlans = [];

        // Create EMI plans for this variant
        if (emiPlansData && emiPlansData.length > 0) {
          for (const planData of emiPlansData) {
            const emiPlan = new EMIPlan({
              productId: null, // Will be set after product is created
              tenure: planData.tenure,
              interestRate: planData.interestRate,
              monthlyPayment: calculateEMI(variantFields.price, planData.interestRate, planData.tenure),
              cashback: planData.cashback || { amount: 0, description: '' }
            });
            await emiPlan.save();
            variantEmiPlans.push(emiPlan._id);
          }
        }

        // Add variant with EMI plan references
        processedVariants.push({
          ...variantFields,
          emiPlans: variantEmiPlans
        });
      }

      // Create product with processed variants
      const product = new Product({
        ...productFields,
        variants: processedVariants
      });
      await product.save();

      // Update EMI plans with product ID
      for (const variant of product.variants) {
        for (const emiPlanId of variant.emiPlans) {
          await EMIPlan.findByIdAndUpdate(emiPlanId, { productId: product._id });
        }
      }

      createdProducts.push(product);
      console.log(`✅ Created product: ${product.name} (Slug: ${product.slug}) with ${product.variants.length} variant(s)`);
    }

    console.log('\n✅ Sample data seeded successfully!');
    console.log(`\n📦 Created ${createdProducts.length} product(s):`);
    createdProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - http://localhost:5173/products/${product.slug}`);
    });
    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    if (error.code === 'ENOENT') {
      console.error(`\n❌ Error: Could not find seedData.json file at: ${path.join(__dirname, '../data/seedData.json')}`);
      console.error('Please make sure the file exists in the server/data/ directory.');
    }
    process.exit(1);
  }
};

seedData();
