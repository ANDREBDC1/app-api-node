require('dotenv').config()
const express = require('express')
const routes = require('./src/routes')
const umzug = require('./src/database/umzug')
require('./src/database')
const cors = require('cors')

const app = express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(routes)

const server = app.listen(process.env.PORT || 8081, async () => {

    await umzug.up();
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
})