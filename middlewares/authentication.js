const authentication = (req,res,next)=>{
    if(req.cookies.jwt){
        next()
    }else{
       return res.status(400).json({msg:'login first'})
    }
}

module.exports = authentication