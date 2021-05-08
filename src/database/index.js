const Sequelize = require('sequelize')
const dbConfig = require('../conf/database.js')
const User = require('../models/User')
const Permission = require('../models/Permission')
const db = new Sequelize(dbConfig);
// const fs = require('fs');
// const path = require('path');
// const sequelize = new Sequelize(dbConfig);
// const db = {};



// const diretoryModels = path.resolve('src', 'models')

// fs
//   .readdirSync(diretoryModels)
//   .filter(file => (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js'))
//   .forEach((file) => {
//     const model = sequelize.import(path.join(diretoryModels, file));
//     db[model.name] = model;
//   });



// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// map
User.init(db);
Permission.init(db)

Object.keys(db.models).forEach((modelName) => { 
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

// association
// User.belongsToMany(Permission, {
//     through: 'userPermissions',
//     as: 'permissions',
//     foreignKey: 'userId',
// })

module.exports = db;