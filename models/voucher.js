const mongoose = require('mongoose')

const VoucherSchema = new mongoose.Schema({
  
    payTo:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true

    },
    grandTotal:{
        type:Number,
        required:true

    },
    payments:[
        {
            bankName:{
                type:String,
                required:true
            },
            chequeNo:{
                type:String,
                required:true
            },
            amount:{
                type:Number,
                required:true
            }
        }
    ]

},{versionKey:false})

const VoucherModel = mongoose.model('paymentVoucher',VoucherSchema)

module.exports = VoucherModel