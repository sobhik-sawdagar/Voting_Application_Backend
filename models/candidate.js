const e = require("express");
const mongoose = require("mongoose");
//const bcrypt = require('bcrypt'); 

//Define the candidate Schema
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            votedAt: {
                type: Date,
                default: Date.now(),
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0,
    },
    
});


const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate; //This is the object that is exported from this file. It is used to interact with the MongoDB database.    