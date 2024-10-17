const express = require('express');
const db = require('./db');

require('dotenv').config(); //This is the object that is used to configure the environment variables. It is used to load the environment variables from the .env file.  

const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser'); //This is the object that is used to parse the body of the request. It is used to extract the data from the request body.

const app = express();

app.use(bodyParser.json()); //This is the middleware that is used to parse the body of the request. It is used to extract the data from the request body.


//const {jwtAuthMiddleware} = require('./jwt') //This is the object that is exported from the jwt.js file. It is used to authenticate the user using the jwt token.

//Import the router files
const userRoutes = require('./routes/userRoutes'); //This is the object that is exported from the userRoutes.js file. It is used to interact with the MongoDB database.
const candidateRoutes = require('./routes/candidateRoutes'); //

//Use the routers
app.use('/user', userRoutes); //This is the router that is used to interact with the MongoDB database.  
app.use('/candidate', candidateRoutes); //This is the router that is used to interact with the MongoDB database.

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
}); //This is the port number that the server listens to.
