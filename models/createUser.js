const mongoose = require('mongoose')

const CreateUserSchema = new mongoose.Schema({
  
    user_id:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Boolean,
        default:false
    }

},{versionKey:false})

const UsersModel = mongoose.model('User',CreateUserSchema)

module.exports = UsersModel