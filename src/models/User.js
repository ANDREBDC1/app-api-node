const {Model, DataTypes} = require('sequelize')
const bcryptjs =  require('bcryptjs')

class User extends Model{
    static init(sequelize) {

        super.init({
            nome: DataTypes.STRING(150),
            email: DataTypes.STRING(150),
            senha: DataTypes.STRING(150),
        },{
            sequelize
        } )

    }
}

// User.beforeSave('save', async (instance, options)=>{

//     const hash = await bcryptjs.hash(instance.senha, 10)
//     instance.senha = hash
//     return instance.save()
// })

module.exports = User;