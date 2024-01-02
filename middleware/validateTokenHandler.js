const AsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const SECRET_TOKEN="1234"

const validateToken = AsyncHandler(async(req,res,next)=>{
    let token;
    const authtoken = req.headers.authorization || req.headers.Authorization;
    if(authtoken && authtoken.startsWith("Bearer")){
        token = authtoken.split(" ")[1];
        jwt.verify(token, SECRET_TOKEN, (err, decoded) =>{
            if(err){
                res.status(401);
                throw new Error("You are not authorised ");
            }
            // console.log(decoded);
            req.user = decoded;
            next();
        })
        if(!token){
            res.status(401);
            throw new Error("You are not authorised ");
        }
    }
});

module.exports = validateToken;