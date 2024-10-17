const jwt = require('jsonwebtoken'); //This is the object that is used to generate the token. It is used to generate the token using the jsonwebtoken module.

const jwtAuthMiddleware = (req, res, next) => {

    //Check if the token is present in the request headers
    const authHeader = req.headers.authorization; //This is the data that is extracted from the request headers.
    if(!authHeader) return res.status(401).json({error: 'Token not found'}); //This is the response that the server sends back to the client if the token is not found.

    //Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1]; //This is the token that is extracted from the request headers.

    if(!token) return res.status(401).json({error: 'Unauthorized'}); //This is the response that the server sends back to the client if the token is not found. 

    //Verify the JWT token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //This is the data that is decoded from the token.
        //Attach the decoded data (user information) to the request object
        req.user = decoded; //This is the data that is attached to the request object.
        next(); //This is the function that is called to move to the next middleware.
    }catch(err){
        console.error(err); //This is the error that is logged in the console.
        res.status(401).json({error: 'Invalid Token'}); //This is the response that the server sends back to the client if the token is invalid.
    }
};

//Function to generate the JWT token
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET); //This is the token that is generated using the user data.
};

module.exports = {jwtAuthMiddleware, generateToken}; //This is the object that is exported from this file. It is used to authenticate the user using the jwt token. 
