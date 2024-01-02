const AsyncHandler = require("express-async-handler")
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

const SECRET_TOKEN="1234"
// @desc register the user
// @route GET /api/user/register
// @access public
const registerUser = AsyncHandler(async(req, res) =>{
    const {username, email, password} = req.body;
    // console.log(username);
    // console.log(email);
    // console.log(password);
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("Email already exists !");
    }
    const hashPass = await bcrypt.hash(password, 10);
    console.log(hashPass);
    const user = await User.create({
        username,
        email,
        password: hashPass,
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id:user._id, email:user.email});
    }else{
        res.status(400)
        throw new Error("There was a problem creating a user ")
    }
})

// @desc login the user
// @route GET /api/user/login
// @access public
const loginUser = AsyncHandler(async(req, res) =>{
    
    const {email, password} = req.body;
    
    if(!email || !password){
        res.status(400);
        throw new Error("Please enter all the fields");
    }
    const user = await User.findOne({email});
    if(!user){
        res.status(400);
        throw new Error("User does not exists");
    }
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email:user.email,
                id:user.id,
            }
        }, SECRET_TOKEN,
        {expiresIn:"30m"}
        );
        console.log(email);
        console.log(password);
        res.status(200).json({accessToken});
        console.log(accessToken);
    }else{
        res.status(401);
        throw new Error("there is a problem in login")
    }
})

// @desc get the details of the user
// @route GET /api/user/current
// @access private
const currentUser = AsyncHandler(async(req,res) =>{
    res.status(200).json({message : "Hello, this is cuurent user !"});
})
module.exports = {registerUser, loginUser, currentUser};