//const MongoClient = require('mongodb').MongoClient;
//destructuring object for mongodb
const {MongoClient} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db) => {
    if(err){
        return console.log("Unable to connect mongodb server");
    }
    console.log("Database is connected");

    // db.collection('Todos').find({completed:false}).toArray().then((docs)=>{
    //     console.log("Todos List");
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log("Unable to get Todos List:",err);
    // });
    db.collection('Todos').find().count().then((count)=>{
        console.log("Todos List count:",count);
        //console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log("Unable to get Todos List:",err);
    });

    //query for users collection
    db.collection('Users').find({name:"Varsha"}).toArray().then((docs)=>{
        console.log("Users List:");
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log("Unable to get Users List:",err);
    });

    db.close();
})