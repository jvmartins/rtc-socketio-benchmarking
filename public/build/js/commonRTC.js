require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/public/js/commonRTC.js":[function(require,module,exports){

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

    setRTCCustomListeners(); // implemented by peers to add custom listeners
}

var setRTCCustomListeners = function (listener){
    listener.apply();
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

},{}]},{},[]);
