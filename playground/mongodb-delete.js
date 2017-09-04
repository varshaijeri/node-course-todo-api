//const MongoClient = require('mongodb').MongoClient;
//destructuring object for mongodb
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db) => {
    if(err){
        return console.log("Unable to connect mongodb server");
    }
    console.log("Database is connected");

    //deleteMany
    // db.collection('Todos').deleteMany({text:"Eat Lunch"}).then((res)=>{
    //     console.log(res)
    // });
    //deleteOne
    // db.collection('Todos').deleteOne({text:"Eat Lunch"}).then((res)=>{
    //     console.log(res);
    // });
    //findOne and delete
    // db.collection('Todos').findOneAndDelete({completed:true}).then((res)=>{
    //     console.log(res);
    // });

    //query users collection
    db.collection('Users').deleteMany({name:"Varsha"}).then((res)=>{
        console.log("Successfully deleted document");
    });
    db.collection('Users').findOneAndDelete({_id:new ObjectID("59acfa7359564e1e40fa132e")}).then((res)=>{
        console.log("Successfully found the document and it");
    });
    //db.close();
})