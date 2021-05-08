const User = require('../models/User')
const bcryptjs =  require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../conf/auth.json')
const servicesAws = require('../services/servicesAws')



const generateToken  = (params = {}) =>{
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 8640
    })
}

module.exports = {
    register: async (req, res) =>{
        const trans = await User.sequelize.transaction();
        try {
            
            const {nome, email, senha, permissoes, urlPerfil, imagemBase64} = req.body

            if(await User.findOne({where :{email}}))
                return res.json({error: 'Email já cadastrado!'})

            const rash = await bcryptjs.hash(senha, 10)
            const user = await User.create({nome, email, senha : rash},
                { transaction: trans })

            if(permissoes && permissoes.length > 0){
                user.addPermissions(permissoes)
            }

            await trans.commit();

            if(urlPerfil){
                // update user
                user.urlAvatar = urlPerfil;
                await user.save()

            }else{

                if(imagemBase64){
                    const {location} = await servicesAws.uploadFile({name: user.id, base64: imagemBase64})
                    user.urlAvatar = location;
                    await user.save()
                }

            }
            
            
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

        jwt.verify(token, authConfig.secret, async(error, decoded) =>{
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
    }

}