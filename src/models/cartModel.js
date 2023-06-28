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