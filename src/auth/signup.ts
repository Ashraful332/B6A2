import express from "express";
const router = express.Router();

router.get('/signup',(req,res)=>{
    res.status(404).send("Only Post method on signup api");
})

export default router