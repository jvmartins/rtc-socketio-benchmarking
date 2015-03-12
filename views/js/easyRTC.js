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

function startCall(otherEasyrtcid) {
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.NOT_CONNECTED) {
        try {
          easyrtc.call(otherEasyrtcid,
                function(caller, media) { // success callback
                    if (media === 'datachannel') {
                        // console.log("made call succesfully");
                        connectList[otherEasyrtcid] = true;
                    }
                },
                function(errorCode, errorText) {
                    connectList[otherEasyrtcid] = false;
                    easyrtc.showError(errorCode, errorText);
                },
                function(wasAccepted) {
                    // console.log("was accepted=" + wasAccepted);
                }
        );
        } catch(callerror) {
            console.log("saw call error ", callerror);
        }
    }
    else {
        easyrtc.showError("ALREADY-CONNECTED", "already connected to " + easyrtc.idToName(otherEasyrtcid));
    }
}

function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
}

function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, "failure to login");
}
