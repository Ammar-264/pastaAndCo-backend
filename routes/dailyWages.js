const express = require('express')
const { addTodayWages, addNewWage, deleteWage, getWages, getAllDaysWages } = require('../controllers/dailyWages')
const router = express.Router()
const WagesModel = require('../models/dailyWages')

router.post('/addNewWage/:id',addNewWage)
router.delete('/deleteWage/:id/:wageId',deleteWage)
router.get('/getWages/:id',getWages)
router.get('/getAllDaysWages',getAllDaysWages)

router.post('/addWageTable',async(req,res)=>{

    let todayDate = `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`;
    
      let month_pattern = new RegExp("[0-9]{4}-[0-9]{2}")
      let date_pattern = new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}")
      
      if(!month_pattern.test(todayDate)){
    
        let split_date = todayDate.split('');
           split_date.splice(5,0,'0');
           todayDate =   split_date.join('')
    
      }
      if(!date_pattern.test(todayDate)){
    
        let split_date = todayDate.split('');
           split_date.splice(8,0,'0');
           todayDate =   split_date.join('')
    
      }
    
      const everyDayWages = await WagesModel.find({});
    
      // if this is first wage table set remaining amount 0 and create wage table
    
      let lastWageTable = everyDayWages[everyDayWages.length - 1];
    
        // if last table exists get remaining amount of last table and create wage table and set remaining amount as last table remaining amount
       await WagesModel.create({
        date: todayDate,
        remainingAmount: lastWageTable.remainingAmount,
        wages: [],
      });

      res.send('table created')
}
)


module.exports = router