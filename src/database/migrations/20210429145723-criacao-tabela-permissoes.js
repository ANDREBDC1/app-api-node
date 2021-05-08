const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    
     await queryInterface.createTable('permissions', {
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
        descricao: {
          type : DataTypes.STRING(150),
          allowNull: false,
        },
        
      });

      await queryInterface.sequelize.models.Permission.bulkCreate([
        { nome: 'admin', descricao: 'Administrador' },
        { nome: 'user', descricao: 'Usuário' }
      ])
  },

  down: async ({ context: queryInterface }) => {
    
     await queryInterface.dropTable('permissions');
  }
};
