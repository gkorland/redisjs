/**
 * Created by guy on 08/08/15.
 */
var net = require('net'),
    readline = require('readline');

var map = {};

var server = net.createServer(function(socket) { //'connection' listener
    console.log('client connected');
    socket.on('end', function() {
        console.log('client disconnected');
    });

    var totalParts = -1,
        parts = 0,
        next = -1,
        command = [],
        reset = function(socket){
            if(socket)
                socket.write('-ERR wrong command\r\n');
            totalParts = -1;
            parts = 0;
            next = -1;
        },
        i = readline.createInterface(socket, socket);

    i.on('line', function (line) {
        console.log(line);
        var prefix = line[0];
        switch(prefix){
            case '*':
                if(totalParts >= 0){
                    return reset(socket);
                }
                totalParts = parseInt(line.substring(1));
                parts = 0;
                next = -1;
                break;
            case '$':
                if(totalParts < 0 || parts >= totalParts || next>=0 ){
                    return reset(socket);
                }
                next = parseInt(line.substring(1));
                break;
            default:
                if(line.length != next){
                    return reset(socket);
                }
                command[parts++] = line;
                next = -1;
                if(parts < totalParts)
                    return;

                switch(command[0].toLowerCase()){
                    case 'info': // TODO Build info
                        socket.write('+OK\r\n');
                        break;
                    case 'ping':
                        socket.write('+PONG\r\n');
                        break;
                    case 'exists':
                        var value = map[command[1]];
                        if(value == undefined) {
                            socket.write(':0\r\n');
                        } else {
                            socket.write(':1\r\n');
                        }
                        break;
                    case 'set':
                        map[command[1]] = command[2];
                        socket.write('+OK\r\n');
                        break;
                    case 'del':
                        var count = 0;
                        for( var i=1; i<parts ; ++i){
                            var key = command[i],
                                value = map[key];
                            if(value != undefined) {
                                delete map[key];
                                ++count;
                            }
                        }
                        socket.write(':' + count + '\r\n');
                        break;
                    case 'get':
                        var value = map[command[1]];
                        if(value == undefined) {
                            socket.write('$-1\r\n');
                        } else {
                            socket.write('$' + value.length.toString() + '\r\n' + value + '\r\n');
                        }
                        break;
                    case 'mget':
                        var result = new Array(parts-1);
                        for( var i=1; i<parts ; ++i){
                            var key = command[i],
                                value = map[key];
                            if(value == undefined) {
                                result[i-1] = '$-1\r\n';
                            } else {
                                result[i-1] = '$' + value.length + '\r\n' + value + '\r\n';
                            }
                        }
                        socket.write('*' + result.length + '\r\n');
                        for( var i=0; i<result.length ; ++i){
                            socket.write(result[i]);
                        }
                        break;
                    default:
                        return reset(socket);
                }
                reset();
                break;
        }



    });
    //socket.write('hello\r\n');
    //socket.pipe(socket);
});

server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(function () {
            server.close();
            server.listen(PORT, HOST);
        }, 1000);
    }
});

server.listen(6379, function() { //'listening' listener
    var address = server.address();
    console.log("opened server on %j", address);
});