const Product = require('../models/Product');
const EMIPlan = require('../models/EMIPlan');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // Populate EMI plans for each variant
    const productsWithPlans = await Promise.all(
      products.map(async (product) => {
        const variantsWithPlans = await Promise.all(
          product.variants.map(async (variant) => {
            const emiPlans = await EMIPlan.find({ _id: { $in: variant.emiPlans } });
            return {
              ...variant.toObject(),
              emiPlans
            };
          })
        );
        return {
          ...product.toObject(),
          variants: variantsWithPlans
        };
      })
    );
    res.json(productsWithPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product by slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Populate EMI plans for each variant
    const variantsWithPlans = await Promise.all(
      product.variants.map(async (variant) => {
        const emiPlans = await EMIPlan.find({ _id: { $in: variant.emiPlans } });
        return {
          ...variant.toObject(),
          emiPlans
        };
      })
    );

    const productWithPlans = {
      ...product.toObject(),
      variants: variantsWithPlans
    };

    res.json(productWithPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product by ID (for backward compatibility)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Populate EMI plans for each variant
    const variantsWithPlans = await Promise.all(
      product.variants.map(async (variant) => {
        const emiPlans = await EMIPlan.find({ _id: { $in: variant.emiPlans } });
        return {
          ...variant.toObject(),
          emiPlans
        };
      })
    );

    const productWithPlans = {
      ...product.toObject(),
      variants: variantsWithPlans
    };

    res.json(productWithPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct
};

