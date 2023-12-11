const express = require("express")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/user.model")



const userRouter = express.Router()

userRouter.post("/register", (req,res) => {
    const {name, email, gender, password} = req.body
    try{
        bcrypt.hash(password, 5, async(err, hash)=> {
           if(err){
            res.status(200).send({error:err})
           }
           else {
            const user = new UserModel({name, email, gender, password:hash})
            await user.save()
            res.status(200).send({msg:"New user registered"})
           }
        });
    }
    catch(err){
        res.status(400).send({error:err})
    }
})


userRouter.post("/login", async(req,res) => {
    const {email,password} = req.body
    try{
        const user = await UserModel.findOne({email})
        bcrypt.compare(password, user.password, (err, result) => {
            if(result){
                const token = jwt.sign({ userID: user._id, name: user.name }, 'masai');
                res.status(200).send({msg: "You have logged in successfully", token: token})
            }
            else{
                res.status(200).send({msg: "Providing Wrong Credentials"})
            }
            
        });
    }
    catch(err){
        res.status(400).send({error:err}) 
    }
})



module.exports={
    userRouter
}
