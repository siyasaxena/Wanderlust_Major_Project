const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected successfully to db")
})
.catch((err)=> {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));  //it is written to use static files of public folder

const sessionOptions = {
    secret : "my supersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
    
};

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
})
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    next();
})

//express router
app.use("/listings",listings);
app.use("/listings/:id/review",reviews);

app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

app.use((err,req,res,next)=>{
    let{status = 500,message="Something went wrong!"}= err;
    console.log("Error caught in middleware!"); // Check karne ke liye console log
    res.status(status).render("error.ejs",{err});
    //res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})