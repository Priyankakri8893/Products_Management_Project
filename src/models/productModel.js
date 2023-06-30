// { 
//     title: {string, mandatory, unique},
//     description: {string, mandatory},
//     price: {number, mandatory, valid number/decimal},
//     currencyId: {string, mandatory, INR},
//     currencyFormat: {string, mandatory, Rupee symbol},
//     isFreeShipping: {boolean, default: false},
//     productImage: {string, mandatory},  // s3 link
//     style: {string},
//     availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
//     installments: {number},
//     deletedAt: {Date, when the document is deleted}, 
//     isDeleted: {boolean, default: false},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  currencyId: { type: String, required: true, enum: ['INR'], trim: true },
  currencyFormat: { type: String, required: true },
  isFreeShipping: { type: Boolean, default: false },
  productImage: { type: String, required: true },
  style: { type: String, trim: true },
  availableSizes: {
    type: [
      {
        type: String,
        enum: ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'],
        required: true,
        trim: true
      }
    ],
    validate: {
      validator: function (sizes) {
        return sizes.length > 0;
      },
      message: 'At least one size must be provided.'
    }
  },
  installments: { type: Number },
  deletedAt: { type: Date },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports= Product