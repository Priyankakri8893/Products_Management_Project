// {
//     userId: {ObjectId, refs to User, mandatory, unique},
//     items: [{
//       productId: {ObjectId, refs to Product model, mandatory},
//       quantity: {number, mandatory, min 1}
//     }],
//     totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
//     totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, trim: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, trim: true },
        quantity: { type: Number, required: true, min: 1, trim: true }
      }
    ],
    totalPrice: { type: Number, required: true, comment: 'Holds total price of all the items in the cart', trim: true },
    totalItems: { type: Number, required: true, comment: 'Holds total number of items in the cart', trim: true }
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
