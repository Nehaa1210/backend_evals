const express = require("express")
const { PostModel } = require("../models/post.model")
const { auth } = require("../middleware/auth.middleware")




const postRouter = express.Router()



postRouter.post("/add",auth, async(req,res) => {
    try{
        const {title, body, device} = req.body
        const npost = new PostModel({
            title,
            body,
            device,
            userID: req.body.userID
        })
        await npost.save()
        res.status(200).send({msg: "New post added",post: npost})
    }
    catch(err){
        res.status(400).send({error:err})
    }
})



postRouter.get("/allposts",auth, async(req,res) => {
    try{
        const {device} = req.query
        let data;
        if(device){
            data = await PostModel.find({device})
        }
        else{
            data = await PostModel.find()
        }
        res.status(200).send(data)
    }
    catch(err){
        res.status(400).send({error:err})
    }
})


postRouter.patch("/update/:userID",auth, async(req,res) => {
    const {userID} = req.params
    try{
        const post = await PostModel.findOne({_id: userID})
        if(req.body.userID === post.userID){
            await PostModel.findByIdAndUpdate({_id: userID}, req.body)
            res.status(200).send({msg: "post is updated"})
        }
        res.status(200).send({msg: "User is Not authorized"})

    }
    catch(err){
        res.status(400).send({error:err}) 
    }
})

postRouter.delete("/delete/:userID",auth, async(req,res) => {
    const {userID} = req.params
    try{
        const post = await PostModel.findOne({_id: userID})
        if(req.body.userID === post.userID){
            await PostModel.findByIdAndDelete({_id: userID}, req.body)
            res.status(200).send({msg: "post is deleted"})
        }
        res.status(200).send({msg: "User is Not deleted"})

    }
    catch(err){
        res.status(400).send({error:err}) 
    }
})




module.exports = {
    postRouter
}