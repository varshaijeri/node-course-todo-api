const mongoose = require('mongoose');
//define the schema
//returns a constructor funtion
var Todo = mongoose.model('Todo',{
    text:{
        type:String,
        //validators
        required:true,
        minlength:1,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number,
        default:null
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    }
});

module.exports = {
    Todo
};