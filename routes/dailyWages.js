const express = require('express')
const { addTodayWages, addNewWage, deleteWage, getWages, getAllDaysWages } = require('../controllers/dailyWages')
const router = express.Router()

router.post('/addNewWage/:id',addNewWage)
router.delete('/deleteWage/:id/:wageId',deleteWage)
router.get('/getWages/:id',getWages)
router.get('/getAllDaysWages',getAllDaysWages)

module.exports = router