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
          type : DataTypes.STRING(200),
          allowNull: false,
        },
        urlAvatar: {
          type : DataTypes.STRING(500),
          allowNull: true,
        },
        tokenReseteSenha: {
          type : DataTypes.STRING(80),
          allowNull: true,
        },
        dataExpTokenReseteSenha:{
          type : DataTypes.DATE,
          allowNull: true,
        }
      });
  },

  down: async ({ context: queryInterface }) => {
    
     await queryInterface.dropTable('users');
  }
};
