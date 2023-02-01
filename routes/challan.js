const express = require('express')
const router = express.Router()
const {createChallan,getAllChallans,getChallan,deleteChallan} = require('../controllers/challan')

router.post('/create',createChallan)
router.get('/getChallans',getAllChallans)
router.get('/getChallan/:id',getChallan)
router.delete('/delete/:id',deleteChallan)


module.exports = router