/**
 **  date      :  2016/9/30
 **  author    :  yummyLcj
 **  function  :  socket 
**/

//switch the status of socket to update the socket
var socketStatusSwitcher = function(){
	var status = true;

	this.setStatus = function(sta){
		status = sta;
	}

	this.getStatus = function(){
		return status;
	}
}

socket = new socket();
socket.socketPolling();

//operate socket
function socket(){
	var wsUrl = "ws://myfickle.cn:1234/ws";
	var pollingTime = 200;
	var websocket = null;

	this.getusUrl = function(){
		return wsUrl;
	}

	this.setwsUrl = function(url){
		wsUrl = url;
	}

	this.getPollingTime = function(){
		return pollingTime;
	}

	this.setPollingTime = function(pt){
		pollingTime = pt;
	}

	this.init = function(){
		websocket = new WebSocket(wsUrl);
	    websocket.binaryType = "arraybuffer";

	    websocket.onopen = function(evt) {
	      onOpen(evt);
	    };

	    websocket.onclose = function(evt) {
	      onClose(evt);
	    };

	    websocket.onmessage = function(evt) {
	      var messageReceive =  onMessage(evt);
	      console.log(messageReceive);
	      var message = convertToObject(messageReceive);
	    };
	    
	    websocket.onerror = function(evt) {
	      onError(evt.data);
	    };
	}

	this.send = function(){
		var dv = convertToArrayBuffer();
		websocket.send(dv);
	}

	this.socketPolling = function(){
		var that=this;
		var switcher = new socketStatusSwitcher();
		var status = switcher.getStatus();
		if( status==true ){
			that.init();
		}
		// if(websocket!=null)
			// this.send();
		// setTimeout(function(){
			// that.socketPolling();
		// },pollingTime);
	}
}

function onOpen(e){
	console.log("connected succeed!!");
}

function onClose(e){
	console.log("connected closed!!!");
}

function onError(e){
	console.log("wobsocket error:"+e);
}

function onMessage(e){
	// console.log(e.data.byteLength);
    var dv = new DataView(e.data)
    var str = ""
    for(var i=0;i<dv.byteLength;i++){
    	var char = dv.getUint8(i).toString(16);
    	if(char.length<2){
    		char = "0"+char;
    	}
    	str=str+char+" ";
    	// str+=char;
    }
	return str;
}

function convertToObject(mR){
	var length = getLength(mR);
	var time = getTime(mR);
	var type = getType(mR);
	var messageBody = getBody(mR);
}

function getBody(mR){
	var body = mR.slice(39);
	// body = body.replace(/\s/g, "");
	return body;
}

function getType(mR){
	var type = "0x";
	for(var i=0;i<3;i++){
		if(mR[35+i]!=" "){
			type+=mR[i+35];
		}
	}
	return parseInt(type);
}

function getLength(mR){
	var length = "0x";
	for(var i=0;i<11;i++){
		if ( mR[i]!=" " ){
			length+=mR[i];
		}
	}
	return parseInt(length);
}

function getTime(mR){
	var timestamp = getTimestamp(mR);
	// var time=new Date(parseInt(timestamp)*1000 ).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")
	var time = new Date(timestamp*1000);
	return time;
}

function getTimestamp(mR){
	var timestamp = "0x";
	for(var i=0;i<24;i++){
		if ( mR[i+11]!=" " ){
			timestamp+=mR[i+11];
		}
	}
	return parseInt(timestamp);
}


function convertToArrayBuffer(){
	var dv = "00 00 00 00 00 00 00 28 63 00 00 00 00 00 00 00 63 00 00 00 63 00 63 63 00 00 00 00 00 00 00 63 73 75 63 63 65 73 73 21 ";
	return dv;
}



//00 00 00 00 00 00 00 28 63 00 00 00 00 00 00 00 63 00 00 00 63 00 63 63 00 00 00 00 00 00 00 63 73 75 63 63 65 73 73 21 