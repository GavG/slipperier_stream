net = require('net');

let max_mtu = 0

//Create the TCP listener
net.createServer(function (socket) {

    //Makes a normal looking https response
    socket.on("data", function (data) {
        
        //Watch the incoming TCP chunks over some time, find the longest
        if (data.length > max_mtu) {
            max_mtu = data.length
        }
    })

    setTimeout(function () {
        //Headers
        socket.write([
            'HTTP/1.1 200 OK',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Encoding: UTF-8',
            'Accept-Ranges: bytes',
            'Access-Control-Allow-Origin: *',
        ].join('\n') + '\n\n')
        //Body
        socket.write(JSON.stringify({ mtu: max_mtu }))

        socket.end()
    }, 500)

    socket.on("error", function(err) {
        //discard errors, attempts to write to the socket after we've done our thing
    })
}).listen(9090)

console.log('ready')