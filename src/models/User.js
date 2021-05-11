const {Model, DataTypes} = require('sequelize')
const bcryptjs =  require('bcryptjs')

class User extends Model{
    static init(sequelize) {

        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
            urlAvatar: DataTypes.STRING,
            tokenReseteSenha: {
                type : DataTypes.STRING,
                allowNull: true,
            },
            dataExpTokenReseteSenha: DataTypes.DATE
        },
        {
            hooks: {
                beforeCreate: async (model, options) => {
                    const rash = await bcryptjs.hash(model.senha, 10)
                    model.senha = rash
                },
                beforeUpdate: async (model, options) => {
                    if (model.changed('senha')) {
                        const rash = await bcryptjs.hash(model.senha, 10)
                        model.senha = rash
                    }
                    
                }
            },
            sequelize
        })

    }

    static associate(models) {
         User.belongsToMany(models.Permission, {
                    through: 'userPermissions',
                    as: 'permissions',
                    foreignKey: 'userId',
                 })
    }
}



module.exports = User;