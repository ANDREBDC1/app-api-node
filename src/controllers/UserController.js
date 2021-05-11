const User = require('../models/User')
const bcryptjs =  require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const servicesAws = require('../services/servicesAws')
const { NetworkFirewall } = require('aws-sdk')



const generateToken  = (params = {}) =>{
    return jwt.sign(params, process.env.SECRET, {
        expiresIn: 8640
    })
}

const getMensageForgotpassword = (user) => {

    const urlReseteSenha = `${process.env.URL_FRONT}/reset?email=${user.email}&token=${user.tokenReseteSenha}`
    const mensagem = `<h2>Olá ${user.nome},</h2>
    <p>Você solicitou o resete da sua senha:<\p>
    <p>Entre no link abaixo<\p>
    <a href="${urlReseteSenha}">Resetar Senha</a>
    <p>Caso não tenha solicitado desconciderar esse email.<\p>
    `
    return mensagem;
}

module.exports = {
    register: async (req, res) =>{
        const trans = await User.sequelize.transaction();
        try {
            
            const {nome, email, senha, permissoes, urlAvatar = '', imagemBase64} = req.body

            if(await User.findOne({where :{email}}))
                return res.json({error: 'Email já cadastrado!'})

            
            const user = await User.create({nome, email, senha, urlAvatar},
                { transaction: trans })

            if(permissoes && permissoes.length > 0){
                user.addPermissions(permissoes)
            }

            await trans.commit();
            if(imagemBase64 && !urlAvatar){
                const {location} = await servicesAws.uploadFile({name: user.id, base64: imagemBase64})
                if(location){
                    user.urlAvatar = location;
                    await user.save()
                } 
            }
            
            
            return res.status(200).json({token : generateToken({id : user.id})});

        }catch(error){
            await trans.rollback();
            return res.status(400).json({error})
        }
        
    },
    login : async (req, res) =>{

        const {email, senha} = req.body

        const user = await User.findOne({ where: {email}})

        if(!user){
            return res.status(400).json({error: 'Email invalida!'})
        }
           
        const isValidate = await bcryptjs.compare(senha, user.senha)

        if(!isValidate){
            return res.status(400).json({error: 'Senha invalida!'})
        }

        return res.status(200).json({token : generateToken({id : user.id})});
    },

    refreshToken: async (req, res) =>{
        const {token}  = req.body

        if(!token)
         res.status(400).json({message: 'Não foi informado o token'})

        jwt.verify(token, process.env.SECRET, async(error, decoded) =>{
            //const decode = jwt.decode(token, authConfig.secret)
            const user = await User.findByPk(decoded.id)
            if(!user){
                return res.status(401).json({message: 'Token Invalido'})
            }

            if(error){
                if(error.name === 'TokenExpiredError'){
                    return res.status(200).json({token : generateToken({id : decoded.id})})
                }
                
                return res.status(401).json({message: 'Token Invalido'})
            }

            return res.status(200).json({token})
        })
    },

    forgotPassword: async (req, res) =>{

        const {email} = req.body;

        const user = await User.findOne({ where: {email}})

        if(!user){
            return res.status(400).json({error: 'Email invalida!'})
        }

        const token = crypto.randomBytes(24).toString('hex');

        user.tokenReseteSenha = token
        const now = new Date()
        now.setHours(now.getHours() + 2)
        user.dataExpTokenReseteSenha = now

        const emailParam = {
            Message: getMensageForgotpassword(user), 
            Subject: 'Solicitação Resente de senha',
            AddressesTo: [user.email]
        }
        const {messageId, error} = await servicesAws.sendEmail(emailParam);

        if(error){
            return res.status(400).json({message: 'erro send email', error})
        }
        await user.save()
        return res.status(200).json({message : 'OK', messageId})
    },

    resetPassword: async (req, res) =>{

        const {email, token, senha} = req.body;

        const user = await User.findOne({ where: {email}})

        if(!user){
            return res.status(400).json({error: 'Email invalida!'})
        }
        if(user.tokenReseteSenha !== token){
            return res.status(400).json({error: 'Token invalido!'})
        }
        const now = new Date()
        if(user.dataExpTokenReseteSenha < now){
            return res.status(400).json({error: 'Token invalido!'})
        }

        user.senha = senha
        user.tokenReseteSenha = null
        user.dataExpTokenReseteSenha=null
        await user.save()
        return res.status(200).json({message : 'OK'})
    }

}