const mongoose = require('mongoose')

const PartySchema = new mongoose.Schema({
  
    party:{
        type:String,
        required:true
    },

},{versionKey:false})

const PartiesModel = mongoose.model('partie',PartySchema)

module.exports = PartiesModel