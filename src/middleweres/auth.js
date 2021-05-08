const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = {
   isAuth(permissions){
        const verifyAuth  = async (req, res, next) => {
            const authHeader = req.headers.authorization
        
            if(!authHeader){
                return res.status(401).json({error: 'No token provided'})
            }

            const parts = authHeader.split(' ')
        
        
            if(parts.length !== 2)
                return res.status(401).send({error: 'Token error'})
            
            const [schame, token] = parts;
        
            if(!/^Bearer$/i.test(schame))
                return res.status(401).send({error: 'Token Malformatted'})
            
            jwt.verify(token, process.env.SECRET, async (error, decoded) => {
                if(error){
                    return res.status(401).json({error: 'Token invalid'})
                }

                const user = await User.findByPk(decoded.id)

                if(!user){
                    return res.status(401).json({error: 'Not authorization'})
                }

                const roulePermission = await  user.getPermissions().map(pm => pm.nome)

                const isPermission = await roulePermission.some(p=> permissions.includes(p))

                if(!isPermission){
                    return res.status(401).json({error: 'Not authorization'})
                }

                req.userId = decoded.id
                return next()
        
            })
        }

        return verifyAuth;
    }
}