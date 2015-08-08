/**
 * Created by guy on 08/08/15.
 */
module.exports = function(map){
    return function(command, socket){
        socket.write('+OK\r\n');
    }
};