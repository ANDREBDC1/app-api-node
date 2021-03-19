const {Model, DataTypes} = require('sequelize')
const bcryptjs =  require('bcryptjs')

class User extends Model{
    static init(sequelize) {

        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
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