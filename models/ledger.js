const mongoose = require('mongoose')

const LedgerSchema = new mongoose.Schema({
  partyId:{
    type:String,
  },
  ledgers:[
    {
      billNo:{
        type:String,
        default:''
      },
       date:{
        type:String,
    
       },
       credit:{
        type:Number,
        default:0
      },
      debit:{
        type:Number,
        default:0
      },
      totalAmount:{
        type:Number,
        default:0
      },
      description:{
        type:String,
        default:''
      }
    }
  ]
 

},{versionKey:false})

const LedgersModel = mongoose.model('ledger',LedgerSchema)

module.exports = LedgersModel