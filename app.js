if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
 
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
app.use(express.json());
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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})

//demo user
// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld"); //user,password
//     res.send(registeredUser);
// })
//express router
app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

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