const Sequelize = require('sequelize')
const dbConfig = require('../conf/database.js')
const User = require('../models/User')

const db = new Sequelize(dbConfig);

User.init(db);

module.exports = db;