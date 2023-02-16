const UsersModel = require("../models/createUser");
const WagesModel = require("../models/dailyWages");

// exports.addNewWage = async (req, res) => {
//   const { description, type, amount } = req.body;
//   const id = req.params.id;

//   if (!type || !amount) {
//     return res.status(400).send({ msg: "kindly fill the fields properly ." });
//   }

//   const addWage = await WagesModel.updateOne(
//     { _id: id },
//     {
//       $push: {
//         wages: {
//           description: description ? description : "",
//           type,
//           amount,
//         },
//       },
//     }
//   );

//   const findWages = await WagesModel.findOne({ _id: id });
//   const all_days_wages = await WagesModel.find();

//   let index_of_wage;
//   for(i=0;i<all_days_wages.length;i++){
//    if(all_days_wages[i]._id == id){
//     index_of_wage = i;
//    }
//   }

//   async function updateAllAmounts(amountType){

//   if(all_days_wages.length-1 != index_of_wage){

//     for(j=index_of_wage+1;j<all_days_wages.length;j++){

//       if(amountType =='debit'){
//          await  WagesModel.findOneAndUpdate({_id:all_days_wages[j]._id},{remainingAmount:all_days_wages[j].remainingAmount - amount}) ;
//       }else{
//         await  WagesModel.findOneAndUpdate({_id:all_days_wages[j]._id},{remainingAmount:all_days_wages[j].remainingAmount + amount}) ;

//       }

//     }
//   }
// }

//   let newRemainingAmmount;

//   if(type == 'debit')
//     {
//       newRemainingAmmount = findWages.remainingAmount - amount;
//       updateAllAmounts('debit')

//     }
//    else if(type=='credit'){
//       newRemainingAmmount = findWages.remainingAmount + amount;
//       updateAllAmounts('credit')

//     }

//   const updateRemainingAmount = await WagesModel.findOneAndUpdate(
//     { _id: id },
//     { remainingAmount: newRemainingAmmount }
//   );

//   res.status(200).json({ msg: "wage added" });
// };


exports.addNewWage = async (req, res) => {
  const { description, type, amount } = req.body;
  const id = req.params.id;

  if (!type || !amount) {
    return res.status(400).send({ msg: "kindly fill the fields properly ." });
  }

  const wageDay = await WagesModel.findOne({ _id: id });

  wageDay.wages.push({
    description: description ? description : "",
    type,
    amount,
  });

  await wageDay.save();

  const all_day_wages = await WagesModel.find();

  let index_of_wage;

  for (i = 0; i < all_day_wages.length; i++) {
    if (all_day_wages[i]._id == id) {
      index_of_wage = i;
    }
  }

  async function updateAllAmounts(amountType) {
    if (all_day_wages.length - 1 != index_of_wage) {
      for (j = index_of_wage + 1; j < all_day_wages.length; j++) {
        if (amountType == "debit") {
          all_day_wages[j].remainingAmount =
            all_day_wages[j].remainingAmount - amount;
        } else {
          all_day_wages[j].remainingAmount =
            all_day_wages[j].remainingAmount + amount;
        }

        await all_day_wages[j].save();
      }
    }
  }

  let newRemainingAmmount;

  if (type == "debit") {
    newRemainingAmmount = wageDay.remainingAmount - amount;
    updateAllAmounts("debit");
  } else if (type == "credit") {
    newRemainingAmmount = wageDay.remainingAmount + amount;
    updateAllAmounts("credit");
  }

  wageDay.remainingAmount = newRemainingAmmount;
  await wageDay.save();

  res.status(200).json({ msg: "wage added" });
};

exports.deleteWage = async (req, res) => {
  const wagesDayId = req.params.id;
  const wageId = req.params.wageId;

  const all_days_wages = await WagesModel.find();

  const findWages = await WagesModel.findOne({ _id: wagesDayId });

  // finding the index of wage which has to be deleted
  let indexOfWage = findWages.wages.findIndex(el=> el._id == wageId)


  let index_of_wage_day = all_days_wages.findIndex(el=> el._id == wagesDayId) ;


  let amountToDelete = findWages.wages[indexOfWage].amount;

  async function updateAllAmounts(amountType){
    if (all_days_wages.length - 1 != index_of_wage_day) {

      for (j = index_of_wage_day + 1; j < all_days_wages.length; j++) {

        if (amountType == "debit") {
  
          all_days_wages[j].remainingAmount = all_days_wages[j].remainingAmount + amountToDelete

        } else if(amountType == 'credit') {

          all_days_wages[j].remainingAmount = all_days_wages[j].remainingAmount - amountToDelete

        }
        await all_days_wages[j].save()
      }
    }
  };


  let newAmount;

  if (findWages.wages[indexOfWage].type == "credit") {

    // if (credit) then subtract wage amount from remaining amount
    newAmount = findWages.remainingAmount - findWages.wages[indexOfWage].amount;

    updateAllAmounts("credit");

  } else if (findWages.wages[indexOfWage].type == "debit") {
    // if (debit) then add wage amount in remaining amount
    newAmount = findWages.remainingAmount + findWages.wages[indexOfWage].amount;

    updateAllAmounts("debit");
  }

   findWages.wages.splice(indexOfWage, 1); // delete wage from wages list

  // // update new remainingAmount and update new wages list
  // const updateWages = await WagesModel.findOneAndUpdate(
  //   { _id: wagesDayId },
  //   { wages: all_wages, remainingAmount: newAmount }
  // );

  findWages.remainingAmount = newAmount;

  await findWages.save()

  res.status(200).json({ msg: "wage deleted" });
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
