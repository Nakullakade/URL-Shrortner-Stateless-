const User=require("../models/user.js");

//to create a cookie value uuid is used
const {v4:uuidv4}=require('uuid');

//to set user with its cookie value(id) by using id
const {setUser}=require("../service/auth.js");


async function handleUserSignUp(req,res){
const {name,email,password}=req.body;
await User.create({
    name,email,password
});
return res.redirect("/");
//return res.render("home");
}

async function handleUserlogin(req,res){
    const {email,password}=req.body;
    const user=await User.findOne({
        email,password
    });
    //console.log(user);
    if(!user) 
    return res.render("login",{
    error:"Invalid Username or Password",
});

//register uuid to const 

//set user with uuid
const token=setUser(user);

//create cookie with uid value
res.cookie("uid",token);
    return res.redirect("/");
}
module.exports={
    handleUserSignUp,
    handleUserlogin,
}