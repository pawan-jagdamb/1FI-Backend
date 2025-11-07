const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.post('/', createProduct);

module.exports = router;

