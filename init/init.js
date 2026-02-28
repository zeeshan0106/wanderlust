const mongoose = require("mongoose");
const initDb = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

const initialize = async () => {
    await Listing.deleteMany({});
    initDb.data = initDb.data.map((el) => ({...el, owner : "69a0093073938e2d36ba3787"}))
    await Listing.insertMany(initDb.data);
    console.log("Sucessful init");
    
}

initialize();