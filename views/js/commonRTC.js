var selfEasyrtcid = "";
var connectList = {};
var channelIsActive = {}; // Tracks which channels are active

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
}
