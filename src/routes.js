const express = require('express')
const sequelize = require('./database')
const UserController = require('./controllers/UserController')
const AuthTestController = require('./controllers/AuthTestController')
const authMiddleware = require('./middleweres/auth')

const routes = express.Router()

routes.get('/', async (req, res) => {

  try{

    await sequelize.authenticate();
    res.status(200).json({mensagem : 'Connection has been established successfully.'});

  }catch(error){
    
     return res.status(400).json({mensagem: 'Unable to connect to the database:', error});

  }
})

// roustes user
routes.post('/api/register', UserController.register)
routes.post('/api/login', UserController.login)
routes.post('/api/refreshToken', UserController.refreshToken)
routes.post('/api/forgotPassword', UserController.forgotPassword)
routes.post('/api/resetPassword', UserController.resetPassword)

// test Auth
routes.get('/api/testAuth', authMiddleware.isAuth(['admin']), AuthTestController.testAuth)

module.exports = routes;