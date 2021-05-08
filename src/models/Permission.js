const {Model, DataTypes} = require('sequelize')

class Permission extends Model{
    static init(sequelize) {

        super.init({
            nome: DataTypes.STRING,
            descricao: DataTypes.STRING
        },{
            sequelize
        })

    }

    static associate(models) {
        Permission.belongsToMany(models.User, {
            through: 'userPermissions',
            as: 'users',
            foreignKey: 'permissionId'
        });
    }
}



module.exports = Permission;