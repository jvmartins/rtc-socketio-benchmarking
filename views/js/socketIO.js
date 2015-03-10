'use strict';

var socket = io.connect('http://localhost:3000');

socket.on('serverMessage', function (data) {
	// console.log('Message received SocketIO: ' + data.message);
	// console.log('Date: ' + Date.now());
	var time = (Date.now() - data.currentTimestamp) + data.date;
	$('#received-socketIO').append('<span>"' + data.message + '" - in ' + time + ' milliseconds</span></br>');
});