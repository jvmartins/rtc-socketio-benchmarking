var socket = io.connect('http://rtc-socketio-benchmarking.herokuapp.com/');
var UAParser = require('ua-parser-js');
var parser = new UAParser();
var $ = require('jquery');
var commonrtc = require('./commonRTC');
var Chart = require('chart.js');

var timeRtc;
var timeSocket;
var messageIdsRendered = {};

var barChart;
var options = {
    scaleBeginAtZero : true,
    scaleShowGridLines : true,
    scaleGridLineColor : "rgba(0,0,0,.05)",
    scaleGridLineWidth : 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: true,
    barShowStroke : true,
    barStrokeWidth : 2,
    barValueSpacing : 5,
    barDatasetSpacing : 1
};

$(function () {
	commonrtc.setRTCCustomListeners = setRTCCustomListeners;

    commonrtc.configureRTCDataChannel();
    configureSocketIO();

    initializeBarChart();
});

function initializeBarChart(){
	var ctx = document.getElementById("bar-chart").getContext("2d");
	var data = {
		labels: [],
	    datasets: [
	        {
	            label: "SocketIO",
	            fillColor: "rgba(220,220,220,0.5)",
	            strokeColor: "rgba(220,220,220,0.8)",
	            highlightFill: "rgba(220,220,220,0.75)",
	            highlightStroke: "rgba(220,220,220,1)",
	            data: []
	        },
	        {
	            label: "RTC",
	            fillColor: "rgba(151,187,205,0.5)",
	            strokeColor: "rgba(151,187,205,0.8)",
	            highlightFill: "rgba(151,187,205,0.75)",
	            highlightStroke: "rgba(151,187,205,1)",
	            data: []
	        }
	    ]
	};
	barChart = new Chart(ctx).Bar(data, options);
}

function configureSocketIO(){
	socket.on('serverMessage', function (data) {
		var time = (Date.now() - data.currentTimestamp) + data.date;
		console.log("SocketIO data: " + data);
		addToChart(time, "socketio", data.messageId);
	});

	socket.on('deviceInfoFromServer', setDeviceInfo);
}

function setDeviceInfo(data){
	console.log('device info');
	var stringData = JSON.stringify(data);
	parser.setUA(stringData);
	
	$('#device_platform').html(parser.getOS().name);
	$('#device_browser').html(parser.getBrowser().name);
}

// Overwrites function
function setRTCCustomListeners(){
    easyrtc.setPeerListener(listenToMessage);
}

function listenToMessage(who, msgType, data) {
    var time = Date.now() - data.date;
    console.log("RTC data: " + data);
    addToChart(time, "rtc", data.messageId);
}

function addToChart(time, technology, messageId) {
	console.log("addToChart");
	if(technology === "socketio"){
		console.log("socketio");
		timeSocket = time;
		renderBarChart(messageId);
	}
	if(technology === "rtc"){
		console.log("rtc");
		timeRtc = time;
		renderBarChart(messageId);
	}
	
}

function renderBarChart(messageId) {
	console.log("Render bar chart: " + messageId);
	var interactionId = "Interaction " + messageId;
	setTimeout(function(){
		if(!messageIdsRendered[interactionId]){
			messageIdsRendered[interactionId] = true;	
			
			console.log("Times:" + timeSocket + " " + timeRtc);
			barChart.addData([timeSocket, timeRtc], interactionId);

			timeRtc = undefined;
			timeSocket = undefined;
		}
	}, 500);
	
}