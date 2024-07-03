const mongoose =require('mongoose');
require('dotenv').config();

// Seet the MongoDB Connection URL
// const mongoURL =  process.env.MONGODB_URL_LOCAL;
const mongoURL = process.env.MONGODB_URL;

// Set up MongoDB Connection

mongoose.connect(mongoURL);

//Get the default Connection
//Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define Event Listeners for database connections
db.on('connected',()=>{
    console.log("Connected to MongoDB Server");
});

db.on('error',(err)=>{
    console.log(err);
});

db.on('disconnected',()=>{
    console.log("Disonnected to MongoDB Server");
});

//Exports the database connection
module.exports = db;