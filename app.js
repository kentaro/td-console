var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , spawn   = require('child_process').spawn
  , td
  , pipe;

server.listen(9090);

app.use(express.bodyParser());

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
app.get('/javascripts/td-console.js', function (req, res) {
    res.sendfile(__dirname + '/public/javascripts/td-console.js');
});

app.post('/api/queries', function (req, res) {
    td = spawn('td', ['query', '-w', '-d', 'castanet', req.body.query]);

    td.stdout.on('data', function (data) {
        pipe.emit('result', { result: data.toString() });
    });
    td.stderr.on('data', function (data) {
        pipe.emit('result', { result: data.toString() });
    });
    td.on('exit', function(code) {
        td = undefined;
        res.send('done: ' + code);
    });
});

io.sockets.on('connection', function (socket) {
    pipe = socket;
});
io.sockets.on('disconnect', function (socket) {
    td   = undefined;
    pipe = undefined;
});
