const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    
     await queryInterface.createTable('userPermissions', {
        id: {
          type : DataTypes.INTEGER,
          primaryKey : true,
          autoIncrement : true,
          allowNull : false
        },
        userId : {
          type : DataTypes.INTEGER,
          references :{
            model : 'users',
            Key: 'id'
          },
          onDelete: 'CASCADE',
          allowNull: false

        },
        permissionId : {
          type : DataTypes.INTEGER,
          references :{
            model : 'permissions',
            Key: 'id'
          },
          onDelete: 'CASCADE',
          allowNull: false

        },
        
      });
  },

  down: async ({ context: queryInterface }) => {
    
     await queryInterface.dropTable('userPermission');
  }
};
