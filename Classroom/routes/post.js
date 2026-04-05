const express = require("express");
const router = express.Router();


//index route - post
router.get("/",(req,res)=>{
    res.send("GET for post");
})
//show route - post
router.get("/:id",(req,res)=>{
    res.send("GET for show post");
})
//post route - post
router.post("/",(req,res)=>{
    res.send("post for posts");
})
//delete route - post
router.delete("/:id",(req,res)=>{
    res.send("delete for post id ");
}) 
module.exports = router;