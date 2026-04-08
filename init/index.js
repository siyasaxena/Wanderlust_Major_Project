const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("connected to DB");
        await initDB();
    } catch (err) {
        console.log("Connection Error:", err);
    }
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        console.log("Old data deleted...");

        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "69d67627e385e5ef63aabb60", 
        }));

        await Listing.insertMany(initData.data);
        console.log("data was initialized");
        
        // Connection close karna zaroori hai script khatam karne ke liye
        mongoose.disconnect(); 
    } catch (err) {
        console.log("Initialization Error:", err);
    }
};

main();