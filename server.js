var express = require('express');
var easyrtc = require('easyrtc');
var http = require('http');

var app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.render('/public/index.html')
});

var server = app.listen(process.env.PORT || 3000, function () {
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

easyrtc.on("getIceConfig", function(connectionObj, callback){
  http.get("http://api.turnservers.com/json/turn?key=DmlyGwApMafNgkizSanIGeUyNPYwWKxk", function(res){
    var data = '';
    res.on('data', function (chunk){
      data += chunk;
    });
    res.on('end',function(){
      var tsPacket = JSON.parse(data);      
      var iceConfig = [{url:"stun:stun.turnservers.com:3478"}];
      for (var i = 0; i < tsPacket.uris.length; i++) {
        iceConfig.push({
          "url": tsPacket.uris[i],
          "username": tsPacket.username,
          "credential": tsPacket.password
        });
      }
      callback(null, iceConfig);
    })
  });
});

io.on('connection', function (socket) {
	socket.on('clientMessage', function (data) {
		var currentTimestamp = Date.now();
		io.emit('serverMessage', { 
			message : data.message, 
			date : currentTimestamp - data.date, 
			currentTimestamp : currentTimestamp,
      messageId: data.messageId
		});
  });
  socket.on('deviceInfo', function (data) {
      io.emit('deviceInfoFromServer', data);
  });
});

