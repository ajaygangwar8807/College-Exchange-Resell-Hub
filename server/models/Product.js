const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a product title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
      min: [0, 'Price must be non-negative'],
      default: 0,
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Used'],
      required: [true, 'Please specify item condition'],
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'],
    },
    listingType: {
      type: String,
      enum: ['sell', 'exchange', 'both'],
      default: 'sell',
    },
    location: {
      type: String,
      default: 'Campus Library / Canteen',
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'exchanged', 'removed'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
