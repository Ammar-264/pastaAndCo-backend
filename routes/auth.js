const express = require('express')
const router = express.Router()
const {createUser,changeUserPassword,loginUser,deleteUser,getUsers, logout} = require('../controllers/auth')
const authentication = require('../middlewares/authentication')

router.post('/createUser',createUser)
router.post('/loginUser',loginUser)
router.get('/logoutUser',logout)
router.get('/getUsers',getUsers)
// router.post('/changePassword/:id',changeUserPassword)
router.delete('/deleteUser/:id',deleteUser)

module.exports = router