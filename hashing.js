const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data  = {
  id: 3
}

var token = jwt.sign(data, '123abc');
console.log(token);


var decoded = jwt.verify(token+'1', '123abc');
console.log(decoded);



// let message = "I am a user no 2.";
// let hash = SHA256(message+'hh').toString();

// console.log(message);
// console.log(hash);


// var data = {
//   id: 3
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }
//
// //token.data.id= 5;
// //token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('same');
// } else {
//   console.log('data corrupt');
// }
