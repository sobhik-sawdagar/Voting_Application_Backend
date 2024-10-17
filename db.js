const mongoose = require("mongoose");
require('dotenv').config(); // This is used to load the environment variables from the .env file. 

// Define MongoDB Connection URL
//const mongoURL = 'mongodb://localhost:27017/RestaurantDB'; // This is the URL of the MongoDB database hosted on the local machine.
const mongoURL = process.env.MONGODB_URL; // This is the URL of the MongoDB database hosted on the cloud. It is stored in the .env file.

// Set up the connection to the MongoDB database with options
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Get the connection object
// This object is used to interact with the MongoDB database.
const db = mongoose.connection;

// Define Event Listeners for the database connection
db.on("error", (err) => {
  console.error("Error connecting to MongoDB database: ", err);
});

db.once("connected", () => {
  console.log("Connected to MongoDB database successfully");
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB database");
});

// Export the database connection object
module.exports = db; // This is the object that is exported from this file. It is used to interact with the MongoDB database.
