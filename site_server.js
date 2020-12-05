const args = process.argv;

var express = require('express')
var app = express()

app.use('/', express.static(__dirname + '/public'))

app.listen(args[2] || 80, function () {
    console.log('listening')
})