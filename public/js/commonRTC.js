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