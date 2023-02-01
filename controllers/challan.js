const ChallanModel =  require('../models/challan')

exports.createChallan=async(req,res)=>{
    const {receiverName,receiverContact,deliverySite,items,client,date} = req.body
  
    if(items.length == 0 || !client ){
        
       return res.status(400).json({msg:'kindly fill the fields properly'})
    }
        const createChallan = await ChallanModel.create({
            date,
            deliverySite,
            receiverName,
            receiverContact,
            client,
            items
        })


        res.status(200).json({data:createChallan,msg:'challan created successfully'})
    

}

exports.getAllChallans =async(req,res)=>{

    const findChallans = await ChallanModel.find({})
    // console.log(findChallans);
    res.status(200).json({data:findChallans,msg:'challans fetched .'})
}


exports.getChallan =async(req,res)=>{
    const id = req.params.id;
    const challan = await ChallanModel.findOne({_id:id});
    res.status(200).json({data:challan,msg:'challan fetched'});
}


exports.deleteChallan =async(req,res)=>{
    const id = req.params.id
    const challan = await ChallanModel.findOneAndDelete({_id:id})
    res.status(200).json({msg:'challan deleted'})
}

