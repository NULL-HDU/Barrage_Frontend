/*
*	websocket engine
*	author:yummyLcj
*	email:luchenjiemail@gmail.com
*/

//switch the status of is updating socket
let socketStatusSwitcher = function(){
	let status = true;

	this.setStatus = function(sta){
		status = sta;
	}

	this.getStatus = function(){
		return status;
	}
}

//action for websocket
export default class socket {
	
	constructor(wsUrl="ws://myfickle.cn:1234/ws",rollingTime=11){
		this.wsUrl = wsUrl;
		this.rollingTime=rollingTime;
	}

	setUrl(url){
		this.wsUrl = url;
	}

	getUrl(){
		return wsUrl;
	}

	init(){
		let ws = new WebSocket(this.wsUrl);
		ws.binaryType = "arraybuffer";
		ws.onopen = function(e) {
	      	onOpen(e);
	    };

	    ws.onclose = function(e) {
	      	onClose(e);
	    };

	    ws.onmessage = function(e) {
	    	onMessage(e);
	    };
	    
	    ws.onerror = function(e) {
	      	onError(e.data);
	    };
		return ws;
	}
}

//when socket is receiving message
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
    }
    console.log(str);
	return str;
}

//when socket is open
function onOpen(e){
	console.log("websocket connected secceed!!");
}

//when socket is close
function onClose(e){
	console.log("websocket closed secceed!!");
}

//when socket is error
function onError(e){
	console.log("Socket error code: "+e.code);
	console.log("Socket error: "+e.data);
}