const express = require('express')
const sequelize = require('./database')

const routes = express.Router()

routes.get('/', (req, res) => {
   sequelize
  .authenticate()
  .then(() => {
       res.json({mensagem : 'Connection has been established successfully.'});
  })
  .catch(err => {
      res.json({mensagem: 'Unable to connect to the database:', erro: err});
  }); 
})

module.exports = routes;