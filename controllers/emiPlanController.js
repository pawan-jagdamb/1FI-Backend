const EMIPlan = require('../models/EMIPlan');
const Product = require('../models/Product');

// Get all EMI plans for a product
const getEMIPlansByProduct = async (req, res) => {
  try {
    const plans = await EMIPlan.find({ productId: req.params.productId });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all EMI plans
const getAllEMIPlans = async (req, res) => {
  try {
    const plans = await EMIPlan.find().populate('productId');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create EMI plan
const createEMIPlan = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const emiPlan = new EMIPlan(req.body);
    await emiPlan.save();

    // Add EMI plan to product
    product.emiPlans.push(emiPlan._id);
    await product.save();

    res.status(201).json(emiPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getEMIPlansByProduct,
  getAllEMIPlans,
  createEMIPlan
};

