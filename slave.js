const PORT = 3000;
const REDIS_ADDR = "localhost";
const REDIS_PORT = 6379;
const NAMESPACE = '/general';

var server = require('http').createServer();
var sticky = require('socketio-sticky-session')
var cluster = require('cluster');
var redis = require('socket.io-redis');
var redisPubSub = require('redis');
var os = require('os');

var sub = redisPubSub.createClient(`redis://${REDIS_ADDR}:${REDIS_PORT}`)
var pub = redisPubSub.createClient(`redis://${REDIS_ADDR}:${REDIS_PORT}`)

var options = {
    proxy: false,
    num: require('os').cpus().length
}
var server = sticky(options, function() {

    // Message received
    sub.on("message", function(channel, message) {
    });

    // Subscribe messages coming from master
    sub.subscribe("master");

    var io_s = require('socket.io').listen(server);
    io_s.adapter(redis({ host: REDIS_ADDR, port: REDIS_PORT }));

    var io = io_s.of(NAMESPACE);
    
    // Connection
    io.on('connection',function(socket){
        socket.emit('connected', { socketid: socket.id });
    });

    return server

}).listen(PORT, function() {
    if(!cluster.worker)
        console.log(('MASTER') + ' | HOST ' + os.hostname() + ' | PORT ' + PORT)
    else
        console.log((cluster.worker.id + ' Worker') + ' | HOST ' + os.hostname() + ' | PORT ' + PORT)
});