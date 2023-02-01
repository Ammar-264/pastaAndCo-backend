const express = require('express')
const router = express.Router()

// controlllers
const {createBill,deleteBill,getAllBills,getSpecificBill, updateItems, updateCartage, updateLoading} = require('../controllers/bill')

router.post('/createNew',createBill)
router.delete('/deleteBill/:id',deleteBill)
router.get('/getBills',getAllBills)
router.get('/getBill/:id',getSpecificBill)



module.exports = router