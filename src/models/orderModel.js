// {
//     userId: {ObjectId, refs to User, mandatory},
//     items: [{
//       productId: {ObjectId, refs to Product model, mandatory},
//       quantity: {number, mandatory, min 1}
//     }],
//     totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
//     totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
//     totalQuantity: {number, mandatory, comment: "Holds total number of quantity in the cart"},
//     cancellable: {boolean, default: true},
//     status: {string, default: 'pending', enum[pending, completed, cancled]},
//     deletedAt: {Date, when the document is deleted}, 
//     isDeleted: {boolean, default: false},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, trim: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, trim: true, trim: true },
        quantity: { type: Number, required: true, min: 1, trim: true }
      }
    ],
    totalPrice: { type: Number, required: true, comment: "Holds total price of all the items in the cart", trim: true },
    totalItems: { type: Number, required: true, comment: "Holds total number of items in the cart", trim: true },
    totalQuantity: { type: Number, required: true, comment: "Holds total number of quantity in the cart", trim: true },
    cancellable: { type: Boolean, default: true, trim: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'canceled'], trim: true },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false, trim: true }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
