var express = require('express')
var app = express()

const PORT = process.env.PORT || 8080

var http = require('http').createServer(app);
var io = require('socket.io')(http);
http.listen(PORT, function () {
    console.log("We have started our server on port " + PORT);
});


app.use(express.static('public'))
    .get('/', function (req, res) {
        res.sendFile(__dirname + '/kharto.html');
    });