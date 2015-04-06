(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
var socket;
var messageCount = 0;
var serverEasyrtcid;
var commonrtc = require('./commonRTC');

$(function(){
    $('#send').click(sendData);
    commonrtc.setRTCCustomListeners(customListener);

    commonrtc.configureRTCDataChannel();
    configureSocketIO();
});

function configureSocketIO(){
    socket = io.connect('http://localhost:3000'); // To run locally
    // socket = io.connect('http://rtc-socketio-benchmarking.herokuapp.com/');
    $('#connectionSocketIO').parent().removeClass("red");
    $('#connectionSocketIO').parent().addClass("green");
}

function customListener(){
    easyrtc.setRoomOccupantListener(automaticStartCall);
}

function automaticStartCall(roomName, occupantList) {
	commonrtc.connectList = occupantList;
    var numberOfOccupants = Object.keys(occupantList).length;
    console.log("Occupant list updated, size: " + numberOfOccupants);
    if(numberOfOccupants > 0) {
    	for (var easyrtcid in commonrtc.connectList) {
            console.log("Room occupant: " + easyrtcid);
    		startCall(easyrtcid);
    		serverEasyrtcid = easyrtcid;
    	}
    } else {
        document.getElementById("send").disabled = true;
        console.log("Not connected to any peer via datachannel");
        $('#connectionRTC').parent().removeClass("green");
        $('#connectionRTC').parent().addClass("red");
    }
}

function startCall(otherEasyrtcid) {
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.NOT_CONNECTED) {
        try {
            easyrtc.call(otherEasyrtcid,
                function(caller, media) {
                    if (media === 'datachannel') {
                        document.getElementById("send").disabled = false;
                        console.log("Connected to peer via datachannel");
                        //$('#connectionRTC').html("RTC Connected");
                        $('#connectionRTC').parent().removeClass("red");
                        $('#connectionRTC').parent().addClass("green");
                        commonrtc.connectList[otherEasyrtcid] = true;
                    }
                },
                function(errorCode, errorText) {
                    commonrtc.connectList[otherEasyrtcid] = false;
                    easyrtc.showError(errorCode, errorText);
                },
                function(wasAccepted) {
                    console.log("Was accepted = " + wasAccepted);
                });
        } catch(callerror) {
            console.log("Saw call error ", callerror);
        }
    } else {
        console.log("Already connected to " + easyrtc.idToName(otherEasyrtcid));
    }
}

function sendData() {
    var strData = 'Message';
    var jsonData = { message: strData, date: Date.now(), messageId: messageCount };

    sendStuffP2P(serverEasyrtcid, jsonData); // Send message P2P via RTC
    
    socket.emit('clientMessage', jsonData); // Send SocketIO

    $('#log').html('<p>Message Sent! (' + ++messageCount + ')</p>')
    
    var browserData = {
        platform: navigator.platform,
        browser: navigator.appName + " " + navigator.appVersion
    }

    socket.emit('deviceInfo', browserData);
}

function sendStuffP2P(otherEasyrtcid, msg) {
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
        easyrtc.sendDataP2P(otherEasyrtcid, 'msg', msg);
        console.log("Message sent to " + otherEasyrtcid);
    } else {
        easyrtc.showError("", "Not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
    }
}
},{"./commonRTC":1}]},{},[2]);