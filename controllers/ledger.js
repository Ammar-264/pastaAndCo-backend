const LedgerModel = require("../models/ledger");

// // deleting ledger

exports.deleteLedger = async (req, res) => {
  const ledger_id = req.params.ledgerId;
  const partyId = req.params.partyId;
  // finding ledger by param id to delete
  const ledgerParty = await LedgerModel.findOne({ partyId: partyId });

  // chaecking if ledger  exists or not
  if (!ledgerParty) {
    return res.status(400).json({ msg: "party not exists" });
  }

  const allLedgers = ledgerParty.ledgers;
  let ledgerIndex;

  for (j = 0; j < allLedgers.length; j++) {
    if (allLedgers[j]._id == ledger_id) {
      ledgerIndex = j;
    }
  }

  let before_date_ledgers = [];
  let same_date_ledgers = [];
  let after_date_ledgers = [];

  for (i = 0; i < allLedgers.length; i++) {

    let ledger_date = new Date(allLedgers[i].date);

    if ( Date.parse(ledger_date) < Date.parse(new Date(allLedgers[ledgerIndex].date)) ) {

      before_date_ledgers.push(allLedgers[i]);
      
    }else if( Date.parse(ledger_date) == Date.parse(new Date(allLedgers[ledgerIndex].date))){
      
      same_date_ledgers.push(allLedgers[i]);
    }
     else {
      after_date_ledgers.push(allLedgers[i]);
    }

  }

  let index_for_del_ledger ;
  
  for(k=0;k<same_date_ledgers.length;k++){

    if (same_date_ledgers[k]._id == ledger_id) {
      index_for_del_ledger = k;
    }

  }

  for(j=0;j<index_for_del_ledger;j++){
      before_date_ledgers.push(same_date_ledgers[j])
  }

  for(j=same_date_ledgers.length-1;j>index_for_del_ledger;j--){
      after_date_ledgers.unshift(same_date_ledgers[j])
  }

  const { debit, credit } = allLedgers[ledgerIndex];

  for (l = 0; l < after_date_ledgers.length; l++) {
    let sum_ledger_id = after_date_ledgers[l]._id;

    await LedgerModel.updateOne(
      {
        partyId: partyId,
        "ledgers._id": sum_ledger_id
      },
      {
        $set: {
        
           "ledgers.$.totalAmount" : after_date_ledgers[l].totalAmount - credit + debit,
          
        },
      }
    );

 
  }
  await LedgerModel.updateOne(
    {
      partyId: partyId,
    },
    {
      $pull: {
        ledgers:{

          _id : allLedgers[ledgerIndex]._id,
          
        }
      }
    }
  );

  res.status(200).json({msg:'ledger deleted successfully'})

};



exports.createLedger = async (req, res) => {
  const { id } = req.params;
  const { debit, credit, description, date, billNo } = req.body;

  let new_ledger_date = new Date(date);


  if(date.length > 10){
    return res.status(400).json({ msg: "enter date correctly" ,code:400});
  }


  if (!debit && !credit) {
    return res.status(400).json({ msg: "enter debit & credit", code: 400 });
  }

 

  const findLedger = await LedgerModel.findOne({ partyId: id });

  const allLedgers = findLedger.ledgers;

  if (allLedgers.length == 0) {
    await LedgerModel.updateOne(
      { partyId: id },
      {
        $push: {
          ledgers: {
            debit: debit ? debit : 0,
            credit: credit ? credit : 0,
            date: date
              ? date
              : `${new Date().getFullYear()}-${
                  new Date().getMonth() + 1
                }-${new Date().getDate()}`,
            description: description ? description : "",
            totalAmount: credit - debit,
            billNo: billNo ? billNo : "",
          },
        },
      }
    );
    return res.status(200).json({ msg: "new ledger aded", code: 200 });
  }

  let before_date_ledgers = [];
  let after_date_ledgers = [];

  for (i = 0; i < allLedgers.length; i++) {
    let ledger_date = new Date(allLedgers[i].date);

    if (
      Date.parse(ledger_date) < Date.parse(new_ledger_date) ||
      Date.parse(ledger_date) == Date.parse(new_ledger_date)
    ) {
      before_date_ledgers.push(allLedgers[i]);
    } else {
      after_date_ledgers.push(allLedgers[i]);
    }
  }

  before_date_ledgers = before_date_ledgers.sort(
    (l1, l2) => (Date.parse(new Date(l1.date))   > Date.parse(new Date(l2.date))) ? 1 : (Date.parse(new Date(l1.date)) <Date.parse(new Date(l2.date))) ? -1 : 0);


  let data = {
    debit: debit ? debit : 0,
    credit: credit ? credit : 0,
    date: date
      ? date
      : `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
    description: description ? description : "",
    billNo: billNo ? billNo : "",
  };

  const newLedgerAdded = await LedgerModel.updateOne(
    { partyId: id },
    {
      $push: {
        ledgers: {
          ...data,
          totalAmount: before_date_ledgers.length !=0?
            (before_date_ledgers[before_date_ledgers.length - 1].totalAmount +
            data.credit) -
            data.debit:
            data.credit -
            data.debit,
        },
      },
    }
  );

  if (newLedgerAdded) {

    for (j = 0; j < after_date_ledgers.length; j++) {
      let ledger_id = after_date_ledgers[j]._id;

      await LedgerModel.updateOne(
        {
          partyId: id,
          "ledgers._id": ledger_id
        },
        {
          $set: {
          
             "ledgers.$.totalAmount" : after_date_ledgers[j].totalAmount + data.credit - data.debit,
            
          },
        }
      );
    }
  }

  res.status(200).json({ msg: "ledger added successfully" ,code:200});
};

exports.getLedgersOfParty = async (req, res) => {
  const id = req.params.id;

  const getLedgers = await LedgerModel.findOne({ partyId: id });

  if (!getLedgers) {
    return res.status(400).json({ msg: "party ledgers not found ..." });
  }

  if (getLedgers.ledgers.length == 0) {
    return res.status(200).json({ data: [] });
  }
  // console.log(getLedgers);

  let un_sorted_ledgers = getLedgers.ledgers;


  for(i=0;i<un_sorted_ledgers.length;i++){
    let date = new Date(un_sorted_ledgers[i].date);
    un_sorted_ledgers[i].date = Date.parse(date);
  }

  let sorted_ledgers = un_sorted_ledgers.sort(
    (l1, l2) => (l1.date > l2.date) ? 1 : (l1.date < l2.date) ? -1 : 0);


    for(j=0;j<sorted_ledgers.length;j++){

      let str_to_num = Number(sorted_ledgers[j].date);

      let date_format = new Date(str_to_num);
      
      sorted_ledgers[j].date = `${date_format.getFullYear()}-${date_format.getUTCMonth()+1}-${date_format.getDate()}`;

      let month_pattern = new RegExp("[0-9]{4}-[0-9]{2}")
      let date_pattern = new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}")
      
      if(!month_pattern.test(sorted_ledgers[j].date)){

        let split_date = sorted_ledgers[j].date.split('');
           split_date.splice(5,0,'0');
           sorted_ledgers[j].date =   split_date.join('')
 
      }
      if(!date_pattern.test(sorted_ledgers[j].date)){

        let split_date = sorted_ledgers[j].date.split('');
           split_date.splice(8,0,'0');
           sorted_ledgers[j].date =   split_date.join('')
 
      }

   
    }
  
  res.status(200).json({ data: sorted_ledgers });
};
