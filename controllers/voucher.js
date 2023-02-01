const VoucherModel= require('../models/voucher')

exports.createVoucher =async(req,res)=>{

    const {payments,payTo,date} = req.body

    if(payments.length == 0 || !payTo){
        return res.status(400).json({msg:'kindly add all the fields'})
    }

    let grandTotal = 0;
    for(i=0;i<payments.length;i++){
       grandTotal += payments[i].amount
    } 

  

    const createVoucher = await VoucherModel.create({
        date,
        payTo,
        grandTotal,
        payments
    })
    res.status(200).json({data:createVoucher,msg:'voucher created successfully'})
}

exports.getVoucher =async(req,res)=>{
    const {id} = req.params;

    const findVoucher = await VoucherModel.findOne({_id:id})
    res.status(200).json({data:findVoucher,msg:'voucher fetched',code:200})
}


exports.getAllVouchers =async(req,res)=>{

    const findVouchers = await VoucherModel.find({})
    res.status(200).json({data:findVouchers,msg:'vouchers fetched...',code:200})
}

exports.deleteVoucher =async(req,res)=>{
 
   
    const {id} = req.params
    const voucherDeleted = await VoucherModel.findOneAndDelete({_id:id})
    res.status(200).json({msg:'voucher deleted successfully',code:200})
}