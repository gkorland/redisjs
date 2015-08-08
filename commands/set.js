/**
 * Created by guy on 08/08/15.
 */
module.exports = function(map){
    return function(command, socket){
        map[command[1]] = command[2];
        socket.write('+OK\r\n');
    }
};