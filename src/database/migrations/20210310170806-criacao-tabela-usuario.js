'use strict';
const { Sequelize } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    
     await queryInterface.createTable('users', {
        id: {
          type : Sequelize.INTEGER,
          primaryKey : true,
          autoIncrement : true,
          allowNull : false
        },
        nome: {
          type : Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type : Sequelize.STRING,
          allowNull: false,
        },
        senha: {
          type : Sequelize.STRING,
          allowNull: false,
        }
      });
  },

  down: async (queryInterface) => {
    
     await queryInterface.dropTable('users');
  }
};
