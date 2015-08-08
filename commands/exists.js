/**
 * Created by guy on 08/08/15.
 */
module.exports = function(map){
    return function(command, socket){
        var value = map[command[1]];
        if(value == undefined) {
            socket.write(':0\r\n');
        } else {
            socket.write(':1\r\n');
        }
    }
};