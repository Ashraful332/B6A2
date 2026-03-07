import express from "express"
const router = express.Router();

router.get('/signin',(req,res)=>{
    res.status(404).send("only post method on signin")
})