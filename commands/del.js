/**
 * Created by guy on 08/08/15.
 */
module.exports = function(map){
    return function(command, socket, parts){
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
    }
};