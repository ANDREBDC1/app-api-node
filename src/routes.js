const express = require('express')
const sequelize = require('./database')
const UserController = require('./controllers/UserController')
const AuthTestController = require('./controllers/AuthTestController')
const authMiddleware = require('./middleweres/auth')

const routes = express.Router()

routes.get('/', async (req, res) => {

  try{

    await sequelize.authenticate();
    res.json({mensagem : 'Connection has been established successfully.'});

  }catch(err){
    
     return res.status(400).send({mensagem: 'Unable to connect to the database:', error: err});

  }
})

routes.post('/api/register', UserController.register)
routes.post('/api/auth', UserController.auth)
routes.get("/api/testAuth", authMiddleware.verifyJwt, AuthTestController.testAuth)

module.exports = routes;