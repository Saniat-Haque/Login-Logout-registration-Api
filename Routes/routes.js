const router=require('express').Router()
const createUser=require('../Controller/controller')

const changePassword=require('../Middleware/changepass')

router.route('/').post(createUser)
router.route('/change').post(changePassword)
module.exports=router