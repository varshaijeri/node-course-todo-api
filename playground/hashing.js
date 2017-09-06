//used only for encryting not decryting
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password ="123abc";
// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(password,salt,(err,hash)=>{
//         console.log(hash)
//     })
// });

var hashedPassword = '$2a$10$zHl0fe7BJ.7t3NU1qsq9ZuglysmvAT4LG7G8tW20FrdFqNlfU6JLe';
bcrypt.compare(password,hashedPassword,(err,res)=>{
    console.log(res);
})

//2 methods to use sign and verify

// var data = {
//     id:10
// };

// var token = jwt.sign(data,'salt');
// var decoded = jwt.verify(token,"salt");
// console.log(token);
// console.log(decoded)
//concept for jwt
// var msg = "I am varsha";
// var hash = SHA256(msg);

// console.log(`Message: ${msg}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id:4
// } 
// //from server to client
// var token = {
//     data,
//     hash:SHA256(JSON.stringify(data)+"salt").toString()
// }

// //intruder might do like this
// // token.data.id = 5;
// // token.data.hash = SHA256(JSON.stringify(token.data)+"salt").toString();

// var resultHash = SHA256(JSON.stringify(token.data)+"salt").toString();

// if(resultHash === token.hash){
//     console.log("Data was not changed");
// }else{
//     console.log("Data was changed. dont trust");
// }

// console.log(`Message: ${JSON.stringify(data,undefined,2)}`);
// console.log(`Hash: ${JSON.stringify(token,undefined,2)}`);
// console.log(`Hash: ${resultHash}`);

//why adding salt?
//mainly because user can manipulate data which has id and re-hash it.So we use some randomly generated 
//salt to store that unique hash value in database.