const User = require('../models/User')

module.exports = {
    insert: async (req, res) =>{
        const {nome, email, senha} = req.body

        const user = await User.create({nome, email, senha})

        return res.json(user);
    }
}