const router=require('express').Router()
const {createUser,changePassword}=require('../Controller/controller')



router.route('/').post(createUser)
// router.route('/change').post(changePassword)

module.exports=router