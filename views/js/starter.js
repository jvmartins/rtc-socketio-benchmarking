var socket = io.connect('http://192.168.0.10:3000');

$(function(){
	$('#send').click(sendData);
	$('#connectionSocketIO').html('SocketIO Connected');
	connectEasyRTC();

	function sendData() {
	  var data = "Test 1";
	  var dataTest1 = { 
	  	message : data, 
	  	date : Date.now()
	  };
	  sendStuffP2P(serverEasyrtcid, data);
	  socket.emit('clientMessage', dataTest1);
	  $("#send").attr('disabled', true);
	  $('#info').append('</br><span style="color: red;"> Test has been started. Check out <a href="/">initial page</a> for tests graphics on your device and browser.</span>');
	}

});

var selfEasyrtcid = "";
var connectList = {};
var channelIsActive = {}; // tracks which channels are active
var serverEasyrtcid = "";

function connectEasyRTC(){
	easyrtc.enableDebug(false);
    easyrtc.enableVideo(false);
    easyrtc.enableAudio(false);
    easyrtc.enableVideoReceive(false);
    easyrtc.enableAudioReceive(false);

    easyrtc.enableDataChannels(true);

    easyrtc.setDataChannelOpenListener(openListener);
    easyrtc.setDataChannelCloseListener(closeListener);

    // easyrtc.setPeerListener(addToConversation);

    easyrtc.setRoomOccupantListener(automaticStartCall);

    easyrtc.connect("easyrtc.dataMessaging", loginSuccess, loginFailure);
}

function openListener(otherParty) {
    channelIsActive[otherParty] = true;
}

function closeListener(otherParty) {
    channelIsActive[otherParty] = false;
}

function automaticStartCall(roomName, occupantList, isPrimary) {
	connectList = occupantList;
	for (var easyrtcid in connectList) {
		startCall(easyrtcid);
		serverEasyrtcid = easyrtcid;
	}
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
                });
          $('#connectionRTC').html("RTC Connected");
        } catch(callerror) {
            console.log("saw call error ", callerror);
        }
    } else {
        //easyrtc.showError("ALREADY-CONNECTED", "already connected to " + easyrtc.idToName(otherEasyrtcid));
    }
}

function sendStuffP2P(otherEasyrtcid, msg) {
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
        easyrtc.sendDataP2P(otherEasyrtcid, 'msg', msg);
    }
    else {
        easyrtc.showError("NOT-CONNECTED", "not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
    }
}

function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
}

function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, "failure to login");
}