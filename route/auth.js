const express = require("express");
const router = express.Router();
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
//middleware
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

//To access tthe User Model
const User = require("../model/User");
const {registerValidation,loginValidation}=require('../validation');
const { genSalt } = require("bcrypt");

//Post the Data register
router.post("/register", async (req, res) => {
  //Lets Validate Data before making User
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

//Checking if the user is already in the database
const emailExist=await User.findOne({email:req.body.email})
if(emailExist) return res.status(400).send('Email alredy Exists')

//Hash The Password
const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(req.body.password,salt)

//Create a New User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password:hashedPassword,
  });
  try {
    const savedUser = await user.save();
    // res.send(savedUser);// responding with whole user details
    res.send({user:user._id})
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login
router.post('/login',async(req,res)=>{
  //Lets Validate Data before making User
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user exist
const user=await User.findOne({email:req.body.email})
if(!user) return res.status(400).send('Email doesnot exist')
  //Check if Password is Correct
  const validPass=await bcrypt.compare(req.body.password,user.password)
  if(!validPass)return res.status(400).send('Invalid Password')

  //create and assign a token
  const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
  res.header('auth-token',token).send(token);
  

})

module.exports = router;
