const Sequelize = require('sequelize')
const dbConfig = require('../conf/database.js')

const db = new Sequelize(dbConfig);

module.exports = db;