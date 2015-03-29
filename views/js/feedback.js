'use strict';

var socket = io.connect('http://localhost:3000');

$(function () {
    configureRTCDataChannel();
    configureSocketIO();
});

function configureSocketIO(){
	socket.on('serverMessage', function (data) {
		var time = (Date.now() - data.currentTimestamp) + data.date;
		$('#received-socketIO').append('<span>"' + data.message + '" - in ' + time + ' milliseconds</span></br>');
	});
}

function setRTCCustomListeners(){
    easyrtc.setPeerListener(listenToMessage);
}

function listenToMessage(who, msgType, content) {
    var timestamp = Date.now() - content.date;
    $('#received-webRTC').append('<span>"' + content.message + '" - in ' + timestamp + ' milliseconds</span></br>');
}