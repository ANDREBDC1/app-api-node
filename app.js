const express = require('express')
const routes = require('./src/routes')
const umzug = require('./src/database/umzug')


const app = express()

//(async () => {
    // Checks migrations and run them if they are not already applied. To keep
    // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
    // will be automatically created (if it doesn't exist already) and parsed.
    //await umzug.up();
 // })();

app.use(express.json())
app.use(routes)

const server = app.listen(process.env.PORT || 8090, async () => {

    await umzug.up();
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
})