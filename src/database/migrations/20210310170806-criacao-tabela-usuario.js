const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    
     await queryInterface.createTable('users', {
        id: {
          type : DataTypes.INTEGER,
          primaryKey : true,
          autoIncrement : true,
          allowNull : false
        },
        nome: {
          type : DataTypes.STRING(150),
          allowNull: false,
        },
        email: {
          type : DataTypes.STRING(150),
          allowNull: false,
        },
        senha: {
          type : DataTypes.STRING(1000),
          allowNull: false,
        }
      });
  },

  down: async ({ context: queryInterface }) => {
    
     await queryInterface.dropTable('users');
  }
};
