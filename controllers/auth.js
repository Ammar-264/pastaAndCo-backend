const UsersModel = require('../models/createUser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// creating new user (only access to admin)
exports.createUser=async(req,res)=>{
 const {password,confirmPassword} = req.body;

 // if passwords are empty sending finishing program
 if(!password || !confirmPassword || (confirmPassword.trim()).length == 0 || (password.trim()).length==0){
    return res.status(400).json({msg:'enter password correctly',code:400});
 }

 // checking if confirm pass and pass are matchin or not
 if(password != confirmPassword){
    return res.status(400).send({msg:'passwords not matched',code:400});
 }

// generating new id for user 
 let user_id = (Math.round(Math.random()*10000000)).toString()

 const allUsers = await UsersModel.find({})

 // checking if  id already exists then create new one
 for (i=0;i<allUsers.length;i++){
    const findUser = await UsersModel.findOne({user_id}) // finding user with id
   
    if(findUser){ // if found creating new id
        user_id = (Math.round(Math.random()*10000000)).toString();
    }
 }
// hashing password
 const securePass = bcrypt.hashSync(password,10)

 // creating new user
 const createUser = await UsersModel.create({
    user_id,
    password:securePass
 })

 res.status(200).json({msg:'user created',code:200})
}

// deleting  user (only access to admin)
exports.deleteUser=async(req,res)=>{
    const id = req.params.id;

    const userToDelete = await UsersModel.findOne({_id:id})
    
    if(!userToDelete){
        return res.status(400).json({msg:'user not found',code:400})
    }

    if(userToDelete.is_admin){
      return  res.status(400).json({msg:' cannot delete admin',code:400})
    }
    
    const userDeleted = await UsersModel.findOneAndDelete({_id:id})
    res.status(200).json({msg:'user deleted successfully',code:200})
}

// change password 
// exports.changeUserPassword=async(req,res)=>{
//   const userId = req.params.id;

//  // checking if user with this id exists or not
//   const userToUpdate = await UsersModel.findOne({user_id:userId})

//   if(!userToUpdate){
//     return res.status(400).send('user not found')
// }

// const {oldPassword,newPassword,confirmNewPassword}  = req.body


//   // if passwords are empty sending finishing program
//   if(!newPassword || !confirmNewPassword || (confirmNewPassword.trim()).length == 0 || (newPassword.trim()).length==0  || !oldPassword || (oldPassword.trim()).length == 0 ){
//     return res.status(400).send('enter password correctly');
//  }
// // comparing if old passsword matched or not
//  const compareOldPass = await bcrypt.compare(oldPassword,userToUpdate.password)

//  if(!compareOldPass){
//     return res.status(400).send('old password not matched')
//  }


//  // checking if new confirm pass and new pass are matchin or not
//  if(newPassword != confirmNewPassword){
//     return res.status(400).send('confirm passwords not matched');
//  }

//  // hashing new password
//  const newPassHash = bcrypt.hashSync(newPassword,10)

//  // updating new password in database
//  const userUpdated = await UsersModel.findOneAndUpdate({user_id:userId},{password:newPassHash})

// res.send(userUpdated)
// }

// login user
exports.loginUser=async(req,res)=>{
    const {userId,password}= req.body
 
    
 
   //checking if all the fields exists
    if( !userId || !password ){
     return (res.status(400).json({
         msg:'kindly fill all the fields properly',
         code:400
     }))
    }

    // checking if user exists with the entered email

    const user_exists = await UsersModel.findOne({user_id:userId})

    if(!user_exists){
        return res.status(400).json({
            msg:"user not found",
            code:400
        })
    }

     // comparing passwords if user exists
      const compare_password = bcrypt.compareSync(password,user_exists.password)
 
    // checking if password is correct or not
    if(!compare_password){
        return res.status(400).json({
            msg:"incorrect password",
            code:400
        })
    }


 
    // creating jwt token and adding id of login user in token
    const token = jwt.sign({user_id:user_exists.user_id},"Pasta_And_Co_Software")


  // passing token in cookie
    res.cookie('jwt',token).status(200).json({token,msg:'logined successfully' , code:200})

}

// get all users (only access to admin)
exports.getUsers=async(req,res)=>{
  const getAllUsers = await UsersModel.find({})
  res.status(200).json({data:getAllUsers,msg:'users fetched .'})
}

exports.logout  =async(req,res)=>{
    res.clearCookie('jwt').status(200).json({msg:'logged out successfully'})
}