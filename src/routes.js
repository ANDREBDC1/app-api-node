const express = require('express')
const sequelize = require('./database')
const UserController = require('./controllers/UserController')
const AuthTestController = require('./controllers/AuthTestController')
const authMiddleware = require('./middleweres/auth')
const multer = require('multer')
const multerConfig = require('./conf/multer')

const routes = express.Router()

routes.get('/', async (req, res) => {

  try{

    await sequelize.authenticate();
    res.json({mensagem : 'Connection has been established successfully.'});

  }catch(err){
    
     return res.status(400).json({mensagem: 'Unable to connect to the database:', error: err});

  }
})

// roustes user
routes.post('/api/register', UserController.register)
routes.post('/api/login', UserController.login)
routes.post('/api/refreshToken', UserController.refreshToken)

// test Auth
routes.get('/api/testAuth', authMiddleware.isAuth(['admin']), AuthTestController.testAuth)

module.exports = routes;