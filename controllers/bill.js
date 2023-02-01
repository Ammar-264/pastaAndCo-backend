const BillModel = require("../models/billModel");
const LedgerModel = require("../models/ledger");
const PartyModel = require("../models/party");

// creating new bill
exports.createBill = async (req, res) => {
  const { party_name, items, cartage, loading, billNo, delivery, date } =
    req.body.billData;

  // checking all the fields are filled by client
  if (!party_name || items.length == 0 || !billNo || !date) {
    return res.status(400).json({ msg: "kindly fill the fields properly" });
  }  
 
  
  if(date.length > 10){
    return res.status(400).json({ msg: "enter date correctly" });

  }
  // adding total amount of all the items in items list
  let grandTotal = 0;

  for (i = 0; i < items.length; i++) {
    grandTotal += items[i].totalAmount;
  }

  // adding data to mongodb
  const data = {
    billNo: billNo,
    party_name: party_name,
    items,
    grandTotal: grandTotal + cartage + loading,
    cartage,
    loading,
    deliverySite: delivery,
    date,
  };

  const billDocAdded = await BillModel(data).save();

  const allParties = await PartyModel.find({});

  let partyId;

  for (j = 0; j < allParties.length; j++) {
    if (party_name.toLowerCase() == allParties[j].party.toLowerCase()) {
      partyId = allParties[j]._id;
    }
  }

  if (!partyId) {
    return res
      .status(200)
      .json({ data: billDocAdded, msg: "bill added successfully" });
  }

  const partyData = await LedgerModel.findOne({ partyId: partyId });

  let ledger_description = "";
  for (i = 0; i < data.items.length; i++) {
    ledger_description += `${data.items[i].description} - `;
  }

  const allLedgers = partyData.ledgers;

  if (partyData && allLedgers.length == 0) {
    await LedgerModel.updateOne(
      { partyId: partyId },
      {
        $push: {
          ledgers: {
            debit: 0,
            credit: data.grandTotal,
            description: ledger_description,
            date: date,
            totalAmount: data.grandTotal,
            billNo: data.billNo,
          },
        },
      }
    );
  } else {

    let before_date_ledgers = [];
    let after_date_ledgers = [];

    for (i = 0; i < allLedgers.length; i++) {

      let ledger_date = new Date(allLedgers[i].date);

      if (
        Date.parse(ledger_date) < Date.parse(new Date(date)) ||
        Date.parse(ledger_date) == Date.parse(new Date(date))
      ) {
        before_date_ledgers.push(allLedgers[i]);
      } else {
        after_date_ledgers.push(allLedgers[i]);
      }
    }

    before_date_ledgers = before_date_ledgers.sort(
     (l1, l2) => (Date.parse(new Date(l1.date))   > Date.parse(new Date(l2.date))) ? 1 : (Date.parse(new Date(l1.date)) <Date.parse(new Date(l2.date))) ? -1 : 0);

  const new_ledger_added =   await LedgerModel.updateOne(
        { partyId: partyId },
        {
          $push: {
            ledgers: {
              debit: 0,
              credit: data.grandTotal,
              description: ledger_description,
              date: date,
              totalAmount:before_date_ledgers.length !=0 ? data.grandTotal + before_date_ledgers[before_date_ledgers.length - 1].totalAmount:data.grandTotal,
              billNo: data.billNo,
            },
          },
        }
      );    


      if (new_ledger_added) {

        for (j = 0; j < after_date_ledgers.length; j++) {
          let ledger_id = after_date_ledgers[j]._id;
    
          await LedgerModel.updateOne(
            {
              partyId: partyId,
              "ledgers._id": ledger_id
            },
            {
              $set: {
              
                 "ledgers.$.totalAmount" : after_date_ledgers[j].totalAmount + data.grandTotal ,
                
              },
            }
          );
        }
      }
  }

  res.status(200).json({ data: billDocAdded, msg: "bill added successfully" });
};
// deleting bill from database
exports.deleteBill = async (req, res) => {
  const deleteBill = await BillModel.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ msg: "bill deleted successfully", code: 200 });
};

// getting all the bills

exports.getAllBills = async (req, res) => {
  const getAllBills = await BillModel.find();

  for(i=0;i<getAllBills.length;i++){
    let date = new Date(getAllBills[i].date);
    getAllBills[i].date = Date.parse(date);
  }

  let sorted_bills = getAllBills.sort(
    (b1, b2) => (b1.date > b2.date) ? 1 : (b1.date < b2.date) ? -1 : 0);

    for(j=0;j<sorted_bills.length;j++){

      let str_to_num = Number(sorted_bills[j].date);

      let date_format = new Date(str_to_num);
      
      sorted_bills[j].date = `${date_format.getFullYear()}-${date_format.getUTCMonth()+1}-${date_format.getDate()}`;

      let month_pattern = new RegExp("[0-9]{4}-[0-9]{2}")
      let date_pattern = new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}")
      
      if(!month_pattern.test(sorted_bills[j].date)){

        let split_date = sorted_bills[j].date.split('');
           split_date.splice(5,0,'0');
           sorted_bills[j].date =   split_date.join('')
 
      }
      if(!date_pattern.test(sorted_bills[j].date)){

        let split_date = sorted_bills[j].date.split('');
           split_date.splice(8,0,'0');
           sorted_bills[j].date =   split_date.join('')
 
      }

   
    }

  res.status(200).json({ data: sorted_bills, msg: "bills fetched" });
};
// getting specific bills

exports.getSpecificBill = async (req, res) => {
  const getBill = await BillModel.findOne({ _id: req.params.id });

  res.send(getBill);
};




