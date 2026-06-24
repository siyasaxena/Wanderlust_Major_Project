const mongoose = require("mongoose");
const { data } = require("./data.js");
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

    // initData.data = initData.data.map((obj) => ({
    //   ...obj,
    //   owner: "69d67627e385e5ef63aabb60",
    // }));

    // 2. Map directly over the destructured 'data' array
    const updatedData = data.map((obj) => ({
      ...obj,
      owner: "69d67627e385e5ef63aabb60",
      geometry: {
        type: "Point",
        coordinates: [0, 0], // Default fallback coordinates [longitude, latitude]
      },
    }));

    // 3. Insert the newly mapped array
    await Listing.insertMany(updatedData);
    console.log("data was initialized");

    // Connection close karna zaroori hai script khatam karne ke liye, // Always good to disconnect cleanly
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  } catch (err) {
    console.log("Initialization Error:", err);
  }
};

main();
