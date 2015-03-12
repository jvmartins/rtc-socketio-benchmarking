var socket = io.connect('http://localhost:3000');

$(function(){
	$("#send").click(sendData);

	function sendData() {
	  var data = "Test 1";
	  var dataTest1 = { 
	  	message : data, 
	  	date : Date.now()
	  };
	  socket.emit('clientMessage', dataTest1);
	  easyrtc.
	  $("#send").attr('disabled', true);
	  $('#info').append('</br><span style="color: red;"> Test has been started. Check out <a href="/">initial page</a> for tests graphics on your device and browser.</span>');
	}
});