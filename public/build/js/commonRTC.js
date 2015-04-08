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
},{}]},{},[1]);