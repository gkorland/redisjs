/**
 * Created by guy on 08/08/15.
 */
module.exports = function(map){
    return function(command, socket, parts){
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
    }
};