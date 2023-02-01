const mongoose = require('mongoose')

const ChallanSchema = new mongoose.Schema({
  
    client:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true

    },
    deliverySite:{
        type:String,
        required:true

    },
    receiverName:{
     type:String,
     
    },
    receiverContact:{
     type:String,

    },
    items:[
        {
            quantity:{
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            }
        }
    ]

},{versionKey:false})

const ChallanModel = mongoose.model('challans',ChallanSchema)

module.exports = ChallanModel