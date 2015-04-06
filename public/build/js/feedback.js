(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    selfEasyrtcid: "",
    connectList: {},
    channelIsActive: {},
    configureRTCDataChannel: function () {
        this.setPropertiesRTC();
        this.setListeners();
        this.connectRTC(); // connects to room for data exchanging

        this.setRTCCustomListeners();
    },
    setPropertiesRTC: function () {
        easyrtc.enableDebug(false);
        easyrtc.enableVideo(false);
        easyrtc.enableAudio(false);
        easyrtc.enableVideoReceive(false);
        easyrtc.enableAudioReceive(false);

        easyrtc.enableDataChannels(true); // only enables data channels
    },
    setListeners: function (){
        easyrtc.setDataChannelOpenListener(this.openListener);
        easyrtc.setDataChannelCloseListener(this.closeListener);
    },
    setRTCCustomListeners: function (listener){
        // overwrite this function
    },
    connectRTC: function() {
        easyrtc.connect("easyrtc.dataMessaging", this.loginSuccess, this.loginFailure);
    },
    openListener: function (otherParty) {
        this.channelIsActive[otherParty] = true;
    },
    closeListener: function (otherParty) {
        this.channelIsActive[otherParty] = false;
    },
    loginSuccess: function (easyrtcid) {
        this.selfEasyrtcid = easyrtcid;
        console.log("Connected to RTC channel as: " + easyrtcid);
    },
    loginFailure: function () {
        easyrtc.showError(errorCode, "failure to login");
    }
};

/*
var selfEasyrtcid = "";
var connectList = {};
var channelIsActive = {}; // Tracks which channels are active

var configureRTCDataChannel = function (){
    setPropertiesRTC();
    setListeners();
    connectRTC(); // connects to room for data exchanging
}

var setPropertiesRTC = function (){
    easyrtc.enableDebug(false);
    easyrtc.enableVideo(false);
    easyrtc.enableAudio(false);
    easyrtc.enableVideoReceive(false);
    easyrtc.enableAudioReceive(false);

    easyrtc.enableDataChannels(true); // only enables data channels
}

var setListeners = function (){
    easyrtc.setDataChannelOpenListener(openListener);
    easyrtc.setDataChannelCloseListener(closeListener);
}

var setRTCCustomListeners = function (listener){
    if(listener) {
        listener.apply();    
    }
}

var connectRTC = function(){
    easyrtc.connect("easyrtc.dataMessaging", loginSuccess, loginFailure);
}

var openListener = function (otherParty) {
    channelIsActive[otherParty] = true;
}

var closeListener = function (otherParty) {
    channelIsActive[otherParty] = false;
}

var loginSuccess = function (easyrtcid) {
    selfEasyrtcid = easyrtcid;
    console.log("Connected to RTC channel as: " + easyrtcid);
}

var loginFailure = function (){
    easyrtc.showError(errorCode, "failure to login");
}

exports.configureRTCDataChannel = configureRTCDataChannel;
exports.setPropertiesRTC = setPropertiesRTC;
exports.setListeners = setListeners;
exports.setRTCCustomListeners = setRTCCustomListeners;
exports.connectRTC = connectRTC;
exports.openListener = openListener;
exports.closeListener = closeListener;
exports.loginSuccess = loginSuccess;
exports.loginFailure = loginFailure;
exports.selfEasyrtcid = selfEasyrtcid;
exports.connectList = connectList;
exports.channelIsActive = channelIsActive;
*/

/*
var selfEasyrtcid = "";
var connectList = {};
var channelIsActive = {};

function configureRTCDataChannel(){
    setPropertiesRTC();
    setListeners();
    connectRTC(); // connects to room for data exchanging
}

function setPropertiesRTC(){
    easyrtc.enableDebug(false);
    easyrtc.enableVideo(false);
    easyrtc.enableAudio(false);
    easyrtc.enableVideoReceive(false);
    easyrtc.enableAudioReceive(false);

    easyrtc.enableDataChannels(true); // only enables data channels
}

function setListeners(){
    easyrtc.setDataChannelOpenListener(openListener);
    easyrtc.setDataChannelCloseListener(closeListener);

    setRTCCustomListeners(); // implemented by peers to add custom listeners
}

function setRTCCustomListeners(){
    // should be implemented by peer
}

function connectRTC(){
    easyrtc.connect("easyrtc.dataMessaging", loginSuccess, loginFailure);
}

function openListener(otherParty) {
    channelIsActive[otherParty] = true;
}

function closeListener(otherParty) {
    channelIsActive[otherParty] = false;
}

function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    console.log("Connected to RTC channel as: " + easyrtcid);
}

function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, "failure to login");
} */

},{}],2:[function(require,module,exports){
'use strict';

//var socket = io.connect('http://localhost:3000'); // To run locally
var socket = io.connect('http://rtc-socketio-benchmarking.herokuapp.com/');
var commonrtc = require('./commonRTC');

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
	$('#device_platform').html(data.platform);
	$('#device_browser').html(data.browser);
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
	if(technology == "socketio"){
		console.log("socketio");
		timeSocket = time;
		renderBarChart(messageId);
	}
	if(technology == "rtc"){
		console.log("rtc");
		timeRtc = time;
		renderBarChart(messageId);
	}
	
}

function renderBarChart(messageId) {
	console.log("Render bar chart: " + messageId);
	setTimeout(function(){
		if(!messageIdsRendered[messageId]){
			messageIdsRendered[messageId] = true;	
			
			console.log("Times:" + timeSocket + " " + timeRtc)
			barChart.addData([timeSocket, timeRtc], messageId);

			timeRtc = undefined;
			timeSocket = undefined;
		}
	}, 1000);
	
}
},{"./commonRTC":1}]},{},[2]);