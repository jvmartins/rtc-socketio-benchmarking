var selfEasyrtcid = "";
var connectList = {};
var channelIsActive = {}; // tracks which channels are active

$(function () {
    easyrtc.enableDebug(false);
    easyrtc.enableVideo(false);
    easyrtc.enableAudio(false);
    easyrtc.enableVideoReceive(false);
    easyrtc.enableAudioReceive(false);

    easyrtc.enableDataChannels(true);

    easyrtc.setDataChannelOpenListener(openListener);
    easyrtc.setDataChannelCloseListener(closeListener);

    easyrtc.setPeerListener(addToConversation);

    easyrtc.connect("easyrtc.dataMessaging", loginSuccess, loginFailure);
});


function addToConversation(who, msgType, content) {
    $('#received-webRTC').append('<span>"' + content + '" - in ' + 'X' + ' milliseconds</span></br>');
}


function openListener(otherParty) {
    channelIsActive[otherParty] = true;
}

function closeListener(otherParty) {
    channelIsActive[otherParty] = false;
}

function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
}

function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, "failure to login");
}
