const User = require('../models/User')
//const UserPermision = require('../models/UserPermision')

const bcryptjs =  require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../conf/auth.json')
//const sequelize = require('../../src/database')


const generateToken  = (params = {}) =>{
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 8640
    })
}

module.exports = {
    register: async (req, res) =>{
        const trans = await User.sequelize.transaction();
        try {
            const {nome, email, senha, permissoes} = req.body

            if(await User.findOne({where :{email}}))
                return res.json({error: 'Email já cadastrado!'})

            const rash = await bcryptjs.hash(senha, 10)
            const user = await User.create({nome, email, senha : rash},
                { transaction: trans })

            if(permissoes && permissoes.length > 0){
                user.addPermissions(permissoes)
            }
            
            await trans.commit();
            return res.status(200).json({token : generateToken({id : user.id})});

        }catch(err){
            await trans.rollback();
            return res.status(500).json({error: 'Error registra usuário'})
        }
        
    },
    login : async (req, res) =>{

        const {email, senha} = req.body

        const user = await User.findOne({ where: {email}})

        if(!user){
            return res.json({error: 'Email não encontrado!'})
        }
           
        const isValidate = await bcryptjs.compare(senha, user.senha)

        if(isValidate){
            return res.json({error: 'Senha invalida!'})
        }

        return res.status(200).json({token : generateToken({id : user.id})});
    },

    refreshToken: async (req, res) =>{
        const {token}  = req.body

        if(!token)
         res.status(401).json({message: 'Não foi informado o token'})

        jwt.verify(token, authConfig.secret, (error, decoded) =>{
            if(error){
                if(error.name === 'TokenExpiredError'){
                    const decode = jwt.decode(token, authConfig.secret)
                    return res.status(200).json({token : generateToken({id : decode.id})})
                }

                return res.status(401).json({message: 'Token Invalido'})
            }

            return res.status(200).json({token})
        })
    }

}