const jwt = require('jsonwebtoken')
const authConfing = require('../conf/auth.json')

module.exports = {
    verifyJwt: (req, res, next) => {
        const token = req.headers.authorization
    
        if(!token)
           return res.status(401).send({error: 'No token provided'})
    
    
        // const parts = authHeader.split(' ')
    
    
        // if(parts.length === 2)
        //     return res.status(401).send({error: 'Token error'})
        
        // const [schame, token] = parts;
    
        // if(!/^Bearer$/i.test(schame))
        //     return res.status(401).send({error: 'Token Malformatted'})
        
        jwt.verify(token, authConfing.secret, (error, decoded) => {
            if(error)
            return res.status(401).send({error: 'Token invalid'})
    
            req.userId = decoded.id
    
            return next();
    
        })
    } 
}