const HTTP_PORT = 8080;
const REDIS_ADDR = "localhost";
const REDIS_PORT = 6379;
const NAMESPACE = '/general';

var server = require('http').createServer();
var io_s = require('socket.io')(server);
var redis = require('socket.io-redis');
var redisPubSub = require('redis');
var adapter = io_s.adapter(redis({ host: REDIS_ADDR, port: REDIS_PORT }));

var io = io_s.of(NAMESPACE);

var sub = redisPubSub.createClient(`redis://${REDIS_ADDR}:${REDIS_PORT}`)
var pub = redisPubSub.createClient(`redis://${REDIS_ADDR}:${REDIS_PORT}`)

// Message received
sub.on("message", function(channel, message) {
});

// Subscribe messages coming from slaves
sub.subscribe("slave");

// Get message from http with this structure -> {"to" : {socketId}, "data" : {data to send client}}
var http = require('http');
http.createServer(function (req, res) {
    // Read body
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
        })
        .on('end', () => {
            // Get socket id and emit data
            body = JSON.parse(Buffer.concat(body).toString());
            io.to(body.to).emit('onMessage', body.data);
        });

    res.write('ok');
    res.end();
}).listen(HTTP_PORT);





