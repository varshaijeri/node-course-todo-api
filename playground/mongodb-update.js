//const MongoClient = require('mongodb').MongoClient;
//destructuring object for mongodb
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db) => {
    if(err){
        return console.log("Unable to connect mongodb server");
    }
    console.log("Database is connected");

    findOneAndUpdate(filter,update,options)
    db.collection('Todos').findOneAndUpdate({_id:new ObjectID("59ad1112feb281a83216f911")},{
        //must use update operators
        $set:{
            completed:true
        }
    },{
        //returns the updated document ,if set to true returns original document
        returnOriginal:false
    }).then((res)=>{
        console.log(res)
    });

    //update users collection for name and increment age
    db.collection('Users').findOneAndUpdate({_id:new ObjectID("59acfa71c4fba2084c482ef0")},{
        $set:{
            name:"Varsha"
        },
        $inc:{
            age:1
        }
    },{
        returnOriginal:false
    }).then((res)=>{
        console.log(res);
    });
    db.close();
})