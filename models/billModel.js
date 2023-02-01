const mongoose = require('mongoose')

const BillSchema = new mongoose.Schema({
  
    billNo:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        
    },
    deliverySite:{
        type:String,
        
    },
    party_name:{
        type:String,
        required:true
    },
    cartage:{
        type:Number,
        required:true
    },
    loading:{
        type:Number,
        required:true
    },
    grandTotal:{
        type:Number,
        default:0,
        required:true
    },
    items:[
        {
            description:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            rate:{
                type:Number,
                required:true
            },
            totalAmount:{
                type:Number,
               default:0,
               required:true
            }
        }
    ]
},{versionKey:false})

const BillModel = mongoose.model('Bill',BillSchema)

module.exports = BillModel