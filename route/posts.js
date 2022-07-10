const express=require('express');
const verify=require('./verifyToken')
const router=express.Router()
router.get('/',verify,(req,res)=>{
    // res.json({posts:{
    //     title:"my first post",
    //     description:"random data you cannot access without logged in "
    // }})
    res.send(req.user)
})


module.exports=router