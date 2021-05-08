require('dotenv').config()
const path = require('path')

const dbConectProducao = {
    dialect: process.env.DIALECT || 'mysql',
    host : process.env.DB_HOST || 'localhost',
    database: process.env.DATABASE || 'dbApi',
    port: process.env.DB_PORT || 52396,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    define: {
        timestamps:  false
    }
}

const dbConectDesenvolvimento = {
    dialect: process.env.DIALECT,
    storage: path.resolve('src', 'database', `${process.env.DATABASE}.db`),
    define: {
        timestamps:  false
    }
    
}

module.exports = process.env.NODE_ENV === 'PRODUCTION'
? dbConectProducao
: dbConectDesenvolvimento
