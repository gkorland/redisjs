/**
 * Created by guy on 08/08/15.
 */
module.exports = function(map){
    return function(command, socket){
        var value = map[command[1]];
        if(value == undefined) {
            socket.write('$-1\r\n');
        } else {
            socket.write('$' + value.length.toString() + '\r\n' + value + '\r\n');
        }
    }
};