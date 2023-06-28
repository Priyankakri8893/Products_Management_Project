// { 
//     fname: {string, mandatory},
//     lname: {string, mandatory},
//     email: {string, mandatory, valid email, unique},
//     profileImage: {string, mandatory}, // s3 link
//     phone: {string, mandatory, unique, valid Indian mobile number}, 
//     password: {string, mandatory, minLen 8, maxLen 15}, // encrypted password
//     address: {
//       shipping: {
//         street: {string, mandatory},
//         city: {string, mandatory},
//         pincode: {number, mandatory}
//       },
//       billing: {
//         street: {string, mandatory},
//         city: {string, mandatory},
//         pincode: {number, mandatory}
//       }
//     },
//     createdAt: {timestamp},
//     updatedAt: {timestamp}
//   }