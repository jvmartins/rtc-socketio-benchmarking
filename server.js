var express = require('express');
var easyrtc = require('easyrtc');

var app = express();

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.render('/views/index.html')
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

var io = require('socket.io')(server);

// Start EasyRTC server with options to change the log level and add dates to the log.
easyrtc.listen(app, io,
    { logLevel: "debug", logDateEnable: true },
    function(err, rtc) {

        // After the server has started, we can still change the default room name
        rtc.setOption("roomDefaultName", "SectorZero");

        // Creates a new application called MyApp with a default room named "SectorOne".
        rtc.createApp(
            "easyrtc.instantMessaging",
            { "roomDefaultName" : "SectorOne" },
            myEasyrtcApp
        );
    }
);

// Setting option for specific application
var myEasyrtcApp = function(err, appObj) {
    appObj.setOption("roomDefaultFieldObj",
         { "roomColor" : { fieldValue:"orange", fieldOption: { isShared:true } } }
    );
};

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

