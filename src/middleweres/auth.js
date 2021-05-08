const jwt = require('jsonwebtoken')
const authConfing = require('../conf/auth.json')
require('dotenv').config()

module.exports = {
    verifyJwt: (req, res, next) => {
        const token = req.headers.authorization
    
        if(!token)
           return res.status(401).json({error: 'No token provided'})
    
    
        // const parts = authHeader.split(' ')
    
    
        // if(parts.length === 2)
        //     return res.status(401).send({error: 'Token error'})
        
        // const [schame, token] = parts;
    
        // if(!/^Bearer$/i.test(schame))
        //     return res.status(401).send({error: 'Token Malformatted'})
        
        jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if(error)
            return res.status(401).json({error: 'Token invalid'})
    
            req.userId = decoded.id
    
            return next();
    
        })
    } 
}