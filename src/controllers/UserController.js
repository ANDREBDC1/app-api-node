const User = require('../models/User')
const bcryptjs =  require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../conf/auth.json')

const generateToken  = (params = {}) =>{
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 8640
    })
}

module.exports = {
    register: async (req, res) =>{
        try {
            const {nome, email, senha} = req.body

            if(await User.findOne({where :{email}}))
                return res.json({error: 'Email já cadastrado!'})

            const rash = await bcryptjs.hash(senha)
            const user = await User.create({nome, email, senha : rash})

            return res.json({token : generateToken({id : user.id})});

        }catch(err){

            return res.status(400).send({error: 'Error registra usuário'})
        }
        
    },
    login : async (req, res) =>{

        const {email, senha} = req.body

        const user = await User.findOne({ where: {email}})

        if(!user){
            return res.json({error: 'Email não encontrado!'})
        }
           

        if(!bcryptjs.compare(senha, user.senha)){
            return res.json({error: 'Senha do usuário invalida!'})
        }

        return res.json({token : generateToken({id : user.id})});
    }
}