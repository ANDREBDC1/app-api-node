const express = require('express')
const sequelize = require('./database')
const UserController = require('./controllers/UserController')

const routes = express.Router()

routes.get('/', (res) => {
   sequelize
  .authenticate()
  .then(() => {
       res.json({mensagem : 'Connection has been established successfully.'});
  })
  .catch(err => {
      res.json({mensagem: 'Unable to connect to the database:', erro: err});
  }); 
})

routes.post('/User', UserController.insert)

module.exports = routes;