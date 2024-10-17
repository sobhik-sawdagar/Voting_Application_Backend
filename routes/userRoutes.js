const express =  require('express');

const router = express.Router();

const User = require('../models/user'); //This is the object that is exported from the user.js file. It is used to interact with the MongoDB database.
const {jwtAuthMiddleware, generateToken} = require('../jwt'); //This is the object that is exported from the jwt.js file. It is used to authenticate the user using the jwt token.



//POST Request for user data
router.post('/signup', async (req,res) => {

    try{
        const data = req.body; //This is the data that is sent in the request body. It is extracted using the body-parser middleware.
        const user = new User(data); //This is the object that is created from the data that is sent in the request body.

        const savedPersonData = await user.save(); //This is the data that is saved in the database.  
        console.log('Response: Person data saved successfully'); //This is the data that is logged in the console if the data is saved successfull        
        
        //Token Generation
        const payload = {
            id: savedPersonData.id,
        };

        console.log(JSON.stringify(payload)); // This is the payload that is logged in the console after converting it to a string.

        const token = generateToken(payload); //This is the token that is generated using the payload.
        console.log('Token Generated:', token); //This is the token that is logged in the console.

        res.status(200).json({Response: savedPersonData, Token: token});  //This is the response that the server sends back to the client if the data is saved successfully.


    }catch(err){
        console.log('Error saving the person data',err); //This is the error that is logged in the console if there is an error.
        res.status(500).json({error: 'Internal server error'}); //This is the response that the server sends back to the client if there is an error.
        //res.status(400).send(err); //This is the response that the server sends back to the client if there is an error.  
    }

});

//Login API Route.
router.post('/login', async (req,res) => {
    try{
        const {aadharCardNumber, password} = req.body; //This is the data that is sent in the request body. It is extracted using the body-parser middleware.

        //Find the user by username in the database
        const user = await User.findOne({aadharCardNumber: aadharCardNumber}); //This is the data that is fetched from the database.  

        //If user is not found or password is incorrect, return an error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid AadharID or Password'}); //This is the response that the server sends back to the client if the username or password is incorrect.
        }

        //Generate the JWT token
        const payload = {
            id: user.id,
        };

        const token = generateToken(payload); //This is the token that is generated using the payload.

        res.status(200).json({Token: token}); //This is the response that the server sends back to the client if the data is saved successfully.    
    }catch(err){
        console.log('Error saving the person data',err); //This is the error that is logged in the console if there is an error.
        res.status(500).json({error: 'Internal server error'}); //This is the response that the server sends back to the client if there is an error.
        //res.status(400).send(err); //This is the response that the server sends back to the client if there is an error.
    }
});

//Profile API Route.
router.get('/profile', jwtAuthMiddleware, async (req,res) => {
    try{
        const userData = req.user; //This is the data that is sent in the request. It is extracted using the user object.
        const userId = userData.id; //This is the id that is extracted from the user data.
        const user = await User.findById(userId); //This is the data that is fetched from the database.

        res.status(200).json({user}); //This is the response that the server sends back to the client if the data is saved successfully.


    }catch(err){
        console.log('Error saving the person data',err); //This is the error that is logged in the console if there is an error.
        res.status(500).json({error: 'Internal server error'}); //This is the response that the server sends back to the client if there is an error.
        //res.status(400).send(err); //This is the response that the server sends back to the client if there is an error.
    }
});



//Put Request to update the person data based on the ObjectId
router.put('/profile/password', jwtAuthMiddleware, async (req,res) => {
    try{
        const userId = req.user; //This is the data that is sent in the request. It is extracted using the user object.
        const {currentPassword, newPassword} = req.body;//This is the data that is sent in the request body. It is extracted using the body-parser middleware.

        //Find the user by userID in the database
        const user = await User.findById(userId); //This is the data that is fetched from the database.

        //if password is incorrect, return an error
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid Current Password'}); //This is the response that the server sends back to the client if the username or password is incorrect.
        }

        //Update the password
        user.password = newPassword; //This is the data that is updated in the database.    
        await user.save(); //This is the data that is saved in the database.    


        console.log('Password Updated');
        res.status(200).json({message: 'Password Updated'}); //This is the response that the server sends back to the client if the data is saved successfully.
    }
    catch(err)
    {
        console.log('Error updating the person data',err);
        res.status(500).json({Error: 'Internal server error'});
    }
});



module.exports = router; //This is the object that is exported from this file. It is used to interact with the MongoDB database.

