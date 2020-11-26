net = require('net');

//Create the TCP listener
net.createServer(function (socket) {

    //Make a normal looking https response
    //Headers
    socket.write([
        'HTTP/1.1 200 OK',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Encoding: UTF-8',
        'Accept-Ranges: bytes',
        'Access-Control-Allow-Origin: *',
    ].join('\n') + '\n\n')

    //Body
    socket.on("data", function (data) {
        //Send back the MTU once we have data to calculate it
        socket.write(JSON.stringify({mtu: data.length}))
        socket.end()
    })

    socket.on("error", function(err) {
        //discard errors, attempts to write to the socket after we've done our thing
    })
}).listen(9090)

console.log('ready')