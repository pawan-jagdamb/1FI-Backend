const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  emiPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EMIPlan'
  }]
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  variants: [variantSchema]
}, {
  timestamps: true
});

// Index for faster slug lookups
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);

