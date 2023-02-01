const express = require('express')
const router = express.Router()
const {createVoucher , getVoucher ,  getAllVouchers , deleteVoucher} = require('../controllers/voucher')

router.post('/create',createVoucher)
router.get('/getVoucher/:id',getVoucher)
router.get('/getAllVouchers',getAllVouchers)
router.delete('/deleteVoucher/:id',deleteVoucher)


module.exports = router