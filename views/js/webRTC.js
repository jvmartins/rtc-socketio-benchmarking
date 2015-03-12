'use strict';

/* globals webkitRTCPeerConnection */



var localPeerConnection, remotePeerConnection;
var sendChannel, receiveChannel;

var closeButton = $('#close-RTC');
var sendButton = $('#close-IO');

var dataChannelSend = $('#sendText');
var dataChannelReceive = $('#received-webRTC');

function trace(text) {
  console.log((window.performance.now() / 1000).toFixed(3) + ': ' + text);
}

function createConnection() {
  var servers = null;
  localPeerConnection = window.localPeerConnection =
  	new webkitRTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
  trace('Created local peer connection object localPeerConnection');

  try {
    sendChannel = localPeerConnection.createDataChannel('sendDataChannel',
      {reliable: false});
    trace('Created send data channel');
  } catch (e) {
    alert('Failed to create data channel. ' +
          'You need Chrome M25 or later with RtpDataChannel enabled');
    trace('createDataChannel() failed with exception: ' + e.message);
  }

  localPeerConnection.onicecandidate = gotLocalCandidate;
  sendChannel.onopen = handleSendChannelStateChange;
  sendChannel.onclose = handleSendChannelStateChange;

  remotePeerConnection = window.remotePeerConnection = new webkitRTCPeerConnection(servers,
    {optional: [{RtpDataChannels: true}]});
  trace('Created remote peer connection object remotePeerConnection');

  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.ondatachannel = gotReceiveChannel;

  localPeerConnection.createOffer(gotLocalDescription);
  closeButton.prop("disabled", false);
}

function gotLocalDescription(desc) {
  localPeerConnection.setLocalDescription(desc);
  trace('Offer from localPeerConnection \n' + desc.sdp);
  remotePeerConnection.setRemoteDescription(desc);
  remotePeerConnection.createAnswer(gotRemoteDescription);
}

function gotRemoteDescription(desc) {
  remotePeerConnection.setLocalDescription(desc);
  trace('Answer from remotePeerConnection \n' + desc.sdp);
  localPeerConnection.setRemoteDescription(desc);
}

function gotLocalCandidate(event) {
  trace('local ice callback');
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(event.candidate);
    trace('Local ICE candidate: \n' + event.candidate.candidate);
  }
}

function gotRemoteIceCandidate(event) {
  trace('remote ice callback');
  if (event.candidate) {
    localPeerConnection.addIceCandidate(event.candidate);
    trace('Remote ICE candidate: \n ' + event.candidate.candidate);
  }
}

function gotReceiveChannel(event) {
  trace('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.onmessage = handleMessage;
  receiveChannel.onopen = handleReceiveChannelStateChange;
  receiveChannel.onclose = handleReceiveChannelStateChange;
}

function handleMessage(event) {
  trace('Received message: ' + event.data);
  $('#received-webRTC').append('<span>"' + event.data + '" - in ' + Date.now() + ' milliseconds </span></br>');
}

function handleSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Send channel state is: ' + readyState);
  if (readyState === 'open') {
    dataChannelSend.prop("disabled", false);
    dataChannelSend.focus();
    dataChannelSend.attr('placeholder', '');
    sendButton.prop("disabled", false);
  closeButton.prop("disabled", false);
  } else {
    dataChannelSend.prop("disabled", true);
    sendButton.prop("disabled", true);
  	closeButton.prop("disabled", true);
  }
}

function handleReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;
  trace('Receive channel state is: ' + readyState);
}

function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  trace('Closed data channel with label: ' + receiveChannel.label);
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  trace('Closed peer connections');
  sendButton.prop("disabled", true);
  closeButton.prop("disabled", true);
  dataChannelSend.val('');
  dataChannelReceive.val('');
  dataChannelSend.prop("disabled", true);
  dataChannelSend.placeholder = 'Press Start, enter some text, then press Send.';
}

$(function(){
	createConnection();
});