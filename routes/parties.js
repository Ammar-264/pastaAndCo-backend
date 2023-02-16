const express  = require('express')
const router = express.Router()
const PartyModel = require('../models/party')
const LedgersModel = require('../models/ledger')


router.post('/addParty',async(req,res)=>{
  if(!req.body.party){
    return res.status(400).json({msg:'enter party name',code:400})
  }

  const parties = await PartyModel.find({})

  for (i=0;i<parties.length;i++){

    if(parties[i].party.toLowerCase() == req.body.party.toLowerCase()){
      return res.status(400).json({
        msg:'party already exists',
        code:400
      })
    }

   

  }

  const addParty = await PartyModel.create({party:req.body.party})

  const addLedersTable = await LedgersModel.create({partyId:addParty._id,ledgers:[]})
  
  res.status(200).json({msg:'party added'})
})

router.get('/getParties',async(req,res)=>{
   
  const parties = await PartyModel.find()

  res.status(200).json({data:parties,msg:'parties fetched'})

})

router.get('/getParty/:id',async(req,res)=>{
   
  const party = await PartyModel.findOne({_id:req.params.id})
  res.status(200).json({data:party.party})

})

router.delete('/delete/:id',async(req,res)=>{
   
  const ledgers = await LedgersModel.find({})
  const party = await PartyModel.findOne({_id:req.params.id})

  for (i=0;i<ledgers.length;i++){
    if(ledgers[i].partyId == party._id){
      const deleteLedgers = await LedgersModel.findOneAndDelete({partyId:party._id});
    }
  }

  const deleteParty = await PartyModel.findOneAndDelete({_id:req.params.id})
  res.status(200).json({msg:'party deleted .'})

})

 
module.exports = router;