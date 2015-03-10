var express = require('express')
var app = express()

app.set("view options", {layout: false})
app.use(express.static(__dirname + '/views'))

app.get('/', function (req, res) {
  res.render('/views/index.html')
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
})

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  	socket.on('clientMessage', function (data) {
		var currentTimestamp = Date.now();
		io.emit('serverMessage', { 
			message : data.message, 
			date : currentTimestamp - data.date, 
			currentTimestamp : currentTimestamp 
		});
	});
});

