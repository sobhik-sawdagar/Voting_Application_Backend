const express =  require('express');

const router = express.Router();

const User = require('../models/user'); //This is the object that is exported from the user.js file. It is used to interact with the MongoDB database.
const Candidate = require('../models/candidate'); //This is the object that is exported from the user.js file. It is used to interact with the MongoDB database.
const {jwtAuthMiddleware, generateToken} = require('../jwt'); //This is the object that is exported from the jwt.js file. It is used to authenticate the user using the jwt token.

const checkAdmin = async (userId) => {
    try{
        const user = await User.findById(userId); //This is the data that is fetched from the database.
      
        if(user.role === 'admin'){ //This is the data that is checked if the user is an admin.
            return true; //This is the data that is returned if the user is an admin.
        }
    
    }catch(err){
        return false; //This is the data that is returned if the user is not an admin.
    }
};


//POST Request to add a candidate
router.post('/', jwtAuthMiddleware, async (req,res) => {
    try{
        console.log(req.user.id);
        if(!(await checkAdmin(req.user.id) )){//This is the data that is checked if the user is an admin.
           
            return res.status(403).json({error: 'Unauthorized'}); //This is the response that the server sends back to the client if the username or password is incorrect.
        }

        const data = req.body; //This is the data that is sent in the request body. It is extracted using the body-parser middleware.
        const newCandidate = new Candidate(data); //This is the object that is created from the data that is sent in the request body.

        const savedCandidateData = await newCandidate.save(); //This is the data that is saved in the database.
        console.log('Response: Candidate data saved successfully'); //This is the data that is logged in the console if the data is saved successfull
        res.status(200).json({"Response": savedCandidateData}); //This is the response that the server sends back to the client if the data is saved successfully.

    }catch(err){
        console.log('Error saving the candidate data',err); //This is the error that is logged in the console if there is an error.
        res.status(500).json({error: 'Internal server error'}); //This is the response that the server sends back to the client if there is an error.
    }
});



router.put('/:candidateId', jwtAuthMiddleware, async (req,res) => {
    try{
        if(!(await checkAdmin(req.user.id) )){//This is the data that is checked if the user is an admin.
            return res.status(403).json({error: 'Unauthorized'}); //This is the response that the server sends back to the client if the username or password is incorrect.
        }

        const candidateId = req.params.candidateId; //This is the data that is sent in the request body. It is extracted using the body-parser middleware.
        const data = req.body; //This is the data that is sent in the request body. It is extracted using the body-parser middleware.

        const updatedCandidateData = await Candidate.findByIdAndUpdate(candidateId, data, {new: true, runValidators: true}); //This is the data that is updated in the database.

        if(!updatedCandidateData){ //This is the data that is checked if the data is not updated.
            return res.status(404).json({error: 'Candidate not found'}); //This is the response that the server sends back to the client if the data is not updated.
        }
    }catch(err){
        console.log('Error updating the candidate data',err); //This is the error that is logged in the console if there is an error.
        res.status(500).json({error: 'Internal server error'}); //This is the response that the server sends back to the client if there is an error.
    }
});


router.delete('/:candidateId', jwtAuthMiddleware, async (req,res) => {
    try{
        if(!(await checkAdmin(req.user.id) )){//This is the data that is checked if the user is an admin.
            return res.status(403).json({error: 'Unauthorized'}); //This is the response that the server sends back to the client if the username or password is incorrect.
        }

        const candidateId = req.params.candidateId; //This is the data that is sent in the request body. It is extracted using the body-parser middleware.
        
        const deletedCandidateData = await Candidate.findByIdAndDelete(candidateId); //This is the data that is deleted from the database.

        if(!deletedCandidateData){ //This is the data that is checked if the data is not deleted.
            return res.status(404).json({error: 'Candidate not found'}); //This is the response that the server sends back to the client if the data is not updated.
        }
    }catch(err){
        console.log('Error updating the candidate data',err); //This is the error that is logged in the console if there is an error.
        res.status(500).json({error: 'Internal server error'}); //This is the response that the server sends back to the client if there is an error.
    }
});


//Voting APT Route
router.post('/vote/:candidateId', jwtAuthMiddleware, async (req,res) => {
   
     //no admin can vote
     //no user can vote more than once

    const candidateId = req.params.candidateId; //This is the data that is sent in the request body. It is extracted using the body-parser middleware.
    const userId = req.user.id; //This is the data that is sent in the request body. It is extracted using the body-parser middleware.
   
    try{
        const candidate = await Candidate.findById(candidateId); //This is the data that is fetched from the database.

        if(!candidate){
            return res.status(404).json({error: 'Candidate not found'}); //This is the response that the server sends back to the client if the data is not found.
        }

        const user = await User.findById(userId); //This is the data that is fetched from the database.

        if(!user){
            return res.status(404).json({error: 'User not found'}); //This is the response that the server sends back to the client if the data is not found.
        }

        if(user.hasVoted){
            return res.status(403).json({error: 'User has already voted'}); //This is the response that the server sends back to the client if the username or password is incorrect.
        }

        if(user.role === 'admin'){
            return res.status(403).json({error: 'Admin cannot vote'}); //This is the response that the server sends back to the client if the username or password is incorrect.
        }


        //Update the candidate document to record the vote count and details of the user who voted
        candidate.votes.push({user: userId}); //This is the data that is pushed into the array.
        candidate.voteCount = candidate.votes.length; //This is the data that is updated in the database.   
        await candidate.save(); //This is the data that is saved in the database.

        //Update the user document to record that the user has voted
        user.hasVoted = true; //This is the data that is updated in the database.
        await user.save(); //This is the data that is saved in the database.    

        res.status(200).json({message: 'Vote recorded successfully'}); //This is the response that the server sends back to the client if the data is saved successfully.

    }catch(err){
        console.log('Error saving the vote data',err); //This is the error that is logged in the console if there is an error.
        res.status(500).json({error: 'Internal server error'}); //This is the response that the server sends back to the client if there is an error.
    }
});

//API to get the vote count of a candidate
router.get('/vote/count', async (req, res) => {
    try{
        const candidate = await Candidate.find().sort({voteCount: 'desc'}); //This is the data that is fetched from the database.

        //Map the candidate data to get the name and vote count of the candidate
        const voteRecord = candidate.map((data) => {
            return {
                Party: data.group,
                Count: data.voteCount
            }
        });

        return res.status(200).json({voteRecord}); //This is the response that the server sends back to the client if the data is fetched successfully.
    }catch(err){
        console.log('Error fetching the vote data',err); //This is the error that is logged in the console if there is an error.
        res.status(500).json({error: 'Internal server error'}); //This is the response that the server sends back to the client if there is an error.
    }
});



module.exports = router; //This is the object that is exported from this file. It is used to interact with the MongoDB database.

