const express = require('express')
const router = express.Router()
const {createLedger, getLedgersOfParty,deleteLedger} = require('../controllers/ledger')



router.post('/createLedger/:id' ,createLedger)
router.get('/getLedgers/:id' ,getLedgersOfParty)
router.delete('/deleteLedger/:ledgerId/:partyId' ,deleteLedger)



module.exports = router