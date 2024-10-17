const e = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt'); 

//Define the user Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },  
    email: {
        type: String, 
        unique: true,
    },
    mobile: {
        type: String,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
        required: true,
    },
    hasVoted: {
        type: Boolean,
        default: false,
    },

   
});

//Define the `pre` middleware function to hash the password before saving the data to the database.
//`pre` middleware functions are executed one after another, when each middleware calls next.
userSchema.pre('save', async function(next){
    const user = this;// This is the object that is created from the data that is sent in the request body.

    if(!user.isModified('password')) return next(); //This is the response that the server sends back to the client if the data is saved successfully.

    try{
        //Hash password generation
        const salt = await bcrypt.genSalt(10); //This is the data that is generated using the bcrypt library.   
        
        //Hashed Password
        const hashedPassword = await bcrypt.hash(user.password, salt); // This is the data that is generated using the bcrypt library.

        //Overwrite the password with the hashed password
        user.password = hashedPassword; //This is the data that is generated using the bcrypt library.    

        next(); //This is the response that the server sends back to the client if the data is saved successfully.
   
    }catch(err){
        return next(err); //This is the response that the server sends back to the client if there is an error.
    }
});

//Define the `methods` function to compare the password with the hashed password.
//`methods` functions are used to define instance methods on the document.
userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        //Compare the password with the hashed password
        return await bcrypt.compare(candidatePassword, this.password); //This is the data that is compared with the hashed password.
    }catch(err){
        return false; //This is the response that the server sends back to the client if there is an error.
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User; //This is the object that is exported from this file. It is used to interact with the MongoDB database.    