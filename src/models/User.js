const {Model, DataTypes} = require('sequelize')

class User extends Model{
    static init(sequelize) {

        super.init({
            id : DataTypes.INTEGER,
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
        },{
            sequelize
        } )

    }
}

module.exports = User;