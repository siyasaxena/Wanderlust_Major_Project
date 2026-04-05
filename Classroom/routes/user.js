const express = require("express");
const router = express.Router();


//index route - users
router.get("/",(req,res)=>{
    res.send("GET for users");
})
//show route - users
router.get("/:id",(req,res)=>{
    res.send("GET for show users");
})
//post route - users
router.post("/",(req,res)=>{
    res.send("post for users");
})
//delete route - users
router.delete("/:id",(req,res)=>{
    res.send("delete for user id ");
})

module.exports = router;