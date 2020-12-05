net = require('net');

let clients = {}

//Create the TCP listener
net.createServer(function (socket) {

    socket.on("data", function (data) {
        
        //Watch the incoming TCP chunks over some time, find the longest, per IP (client)
        if (
            !clients[socket.remoteAddress] 
            || data.length > clients[socket.remoteAddress].mtu
        ) {
            clients[socket.remoteAddress] = {
                mtu: data.length,
            }

            respondWithMtu(socket)
        }
    })

    socket.on("error", function(err) {
        //discard errors, attempts to write to the socket after we've done our thing
    })
    
}).listen(9090)

function respondWithMtu(socket) {
    //Return a normal looking http resp after some time
    if (clients[socket.remoteAddress].response_timeout) {
        clearTimeout(clients[socket.remoteAddress].response_timeout)
    }

    clients[socket.remoteAddress].response_timeout = responder_timeout = setTimeout(() => {
        //Headers
        socket.write([
            'HTTP/1.1 200 OK',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Encoding: UTF-8',
            'Accept-Ranges: bytes',
            'Access-Control-Allow-Origin: *',
        ].join('\n') + '\n\n')

        //Body
        socket.write(JSON.stringify({ 
            mtu: clients[socket.remoteAddress].mtu
        }))

        console.log('RESP to IP: ' + socket.remoteAddress + ' MTU: ' + clients[socket.remoteAddress].mtu)

        //Unset the client data
        delete clients[socket.remoteAddress]

        socket.end()

    }, 500)
}

console.log('ready')