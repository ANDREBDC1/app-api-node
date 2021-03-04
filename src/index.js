const express = require('express')
const routes = require('./routes')

const app = express()

app.use(express.json())
app.use(routes)

const server = app.listen(process.env.PORT || 8090, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
})