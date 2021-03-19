const User = require('../models/User')
const bcryptjs =  require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../conf/auth.json')

const generateToken  = async (params = {}) =>{
    return await jwt.sign(params, authConfig.secret, {
        expiresIn: 8640
    })
}

module.exports = {
    register: async (req, res) =>{
        try {
            const {nome, email, senha} = req.body

            if(await User.findOne({email}))
                return res.status(400).send({error: 'Email já cadastrado!'})

            const user = await User.create({nome, email, senha})

            return res.json({token : generateToken({id : user.id})});

        }catch(err){

            return res.status(400).send({error: 'Error registra usuário'})
        }
        
    },
    login : async (req, res) =>{

        const {email, senha} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.json({error: 'Email não encontrado!'})
        }
           

        if(!bcryptjs.compare(senha, user.senha)){
            return res.json({error: 'Senha do usuário invalida!'})
        }

        return res.json({token : generateToken({id : user.id})});
    }
}