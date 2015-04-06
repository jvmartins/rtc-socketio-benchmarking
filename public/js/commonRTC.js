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
