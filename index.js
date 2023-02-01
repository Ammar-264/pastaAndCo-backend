
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 4000
const cors = require('cors')
const bodyParser = require('body-parser')
const cron = require('node-cron')
const WagesModel = require("./models/dailyWages");


app.use(cookieParser())
require('dotenv').config()
app.use(cors())
require('./db/connection')
app.use(bodyParser.json());



app.use(cors({
  // preflightContinue: true,
  credentials: true,
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods","GET,PUT,PATCH,POST,DELETE")
    next();
  });
  

// importing routers
const billRouter = require('./routes/bill')
const ledgerRouter = require('./routes/ledger')
const partyRouter = require('./routes/parties')
const dailyWagesRouter = require('./routes/dailyWages')
const authRouter = require('./routes/auth')
const voucherRouter = require('./routes/voucher')
const challanRouter = require('./routes/challan')


app.use('/bill',billRouter)
app.use('/ledger',ledgerRouter)
app.use('/party',partyRouter)
app.use('/dailyWages',dailyWagesRouter)
app.use('/authentication',authRouter)
app.use('/paymentVoucher',voucherRouter)
app.use('/challan',challanRouter)


const createWageTable =async()=>{
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

}

const deleteWage =async ()=>{
  const everyDayWages = await WagesModel.find({});

  for(i=0;i<everyDayWages.length;i++){
    if(everyDayWages[i].date == "2023-01-16"){
      await WagesModel.findOneAndDelete({_id:everyDayWages[i]._id})
    }
  }
}

// deleteWage()
// cron.schedule('* */1 * * * *', () => {
  // createWageTable();
// },{
  // scheduled: true,
//   timezone:'gmt'
// });




app.listen(port,()=>{
    console.log('running on port 3000');
})