const express = require('express');
const router = express.Router();
const {
  getEMIPlansByProduct,
  getAllEMIPlans,
  createEMIPlan
} = require('../controllers/emiPlanController');

router.get('/', getAllEMIPlans);
router.get('/product/:productId', getEMIPlansByProduct);
router.post('/', createEMIPlan);

module.exports = router;

