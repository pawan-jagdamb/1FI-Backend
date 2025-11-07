const mongoose = require('mongoose');

const emiPlanSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  tenure: {
    type: Number,
    required: true,
    min: 1
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  monthlyPayment: {
    type: Number,
    required: true,
    min: 0
  },
  cashback: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    description: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EMIPlan', emiPlanSchema);

