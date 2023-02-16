const mongoose = require('mongoose')

const DailyWagesSchema = new mongoose.Schema({
  
    date:{
        type:String,
        required:true
    },
   remainingAmount:{
    type:Number,
    required:true
   },
   
   wages:[
    {
        description:{
            type:String,
        },
        type:{
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

const WagesModel = mongoose.model('Dailywage',DailyWagesSchema)

module.exports = WagesModel