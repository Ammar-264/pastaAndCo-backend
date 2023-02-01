const WagesModel = require("../models/dailyWages");


exports.addNewWage = async (req, res) => {
  const { description, type, amount } = req.body;
  const id = req.params.id;

  if (!type || !amount) {
    return res.status(400).send({ msg: "kindly fill the fields properly ." });
  }

  const addWage = await WagesModel.updateOne(
    { _id: id },
    {
      $push: {
        wages: {
          description: description ? description : "",
          type,
          amount,
        },
      },
    }
  );

  const findWages = await WagesModel.findOne({ _id: id });
  const all_days_wages = await WagesModel.find();

  let index_of_wage;
  for(i=0;i<all_days_wages.length;i++){
   if(all_days_wages[i]._id == id){
    index_of_wage = i;
   }
  }

  
  async function updateAllAmounts(amountType){
    
  if(all_days_wages.length-1 != index_of_wage){

    for(j=index_of_wage+1;j<all_days_wages.length;j++){

      if(amountType =='debit'){
         await  WagesModel.findOneAndUpdate({_id:all_days_wages[j]._id},{remainingAmount:all_days_wages[j].remainingAmount - amount}) ;
      }else{
        await  WagesModel.findOneAndUpdate({_id:all_days_wages[j]._id},{remainingAmount:all_days_wages[j].remainingAmount + amount}) ;
        
      }

      
    }
  }
}

  let newRemainingAmmount;

  if(type == 'debit')
    {
      newRemainingAmmount = findWages.remainingAmount - amount;
      updateAllAmounts('debit')
    
    }
   else if(type=='credit'){
      newRemainingAmmount = findWages.remainingAmount + amount;
      updateAllAmounts('credit')
     
    }
  

  const updateRemainingAmount = await WagesModel.findOneAndUpdate(
    { _id: id },
    { remainingAmount: newRemainingAmmount }
  );

  res.status(200).json({ msg: "wage added" });
};

exports.deleteWage = async (req, res) => {
  const wagesDayId = req.params.id;
  const wageId = req.params.wageId;

  const findWages = await WagesModel.findOne({ _id: wagesDayId });

 // finding the index of wage which has to be deleted
  let indexOfWage;


  for (i = 0; i < findWages.wages.length; i++) {
    if (findWages.wages[i]._id == wageId) {
      indexOfWage = i;
    }
  }

  // updating delete amount

  const all_days_wages = await WagesModel.find();

  let index_of_wage_day;

  for(k=0;k<all_days_wages.length;k++){
   if(all_days_wages[k]._id == wagesDayId){
    index_of_wage_day = k;
   }
  }

  
  let deleteAmount = findWages.wages[indexOfWage].amount
  
   const updateAllAmounts=async(amountType)=>{
  if(all_days_wages.length-1 != index_of_wage_day){

    for(j=index_of_wage_day+1;j<all_days_wages.length;j++){

      if(amountType =='debit'){
         await  WagesModel.findOneAndUpdate({_id:all_days_wages[j]._id},{remainingAmount:all_days_wages[j].remainingAmount + deleteAmount}) ;
      }else{
        await  WagesModel.findOneAndUpdate({_id:all_days_wages[j]._id},{remainingAmount:all_days_wages[j].remainingAmount - deleteAmount}) ;
        
      }
   
      
    }
  }
}

let all_wages = findWages.wages;
  
  let newAmount ;

  if(all_wages[indexOfWage].type == 'credit'){ // if (credit) then subtract wage amount from remaining amount
    newAmount = findWages.remainingAmount - all_wages[indexOfWage].amount;
    updateAllAmounts('credit')
    
  }else if(all_wages[indexOfWage].type == 'debit'){ // if (debit) then add wage amount in remaining amount
    newAmount = findWages.remainingAmount + all_wages[indexOfWage].amount;
    updateAllAmounts('debit')
   
  }


  let newWagesList = all_wages.splice(indexOfWage, 1); // delete wage from wages list

  // update new remainingAmount and update new wages list
  const updateWages = await WagesModel.findOneAndUpdate(
    { _id: wagesDayId },
    { wages: all_wages , remainingAmount:newAmount}
  );

  res.status(200).json({msg:"wage deleted"});

};

exports.getWages = async (req, res) => {
  const id = req.params.id;

  const findWages = await WagesModel.findOne({ _id: id });



 

  res.status(200).json({ data: findWages });
};

exports.getAllDaysWages = async (req, res) => {
  const allDaysWages = await WagesModel.find({});
  res.status(200).json({ data: allDaysWages, msg: "wages fetched ." });
};
