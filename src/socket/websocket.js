/*
*	websocket engine
*	author:yummyLcj
*	email:luchenjiemail@gmail.com
*/

import * as analyis from "./analyis.js"

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
	
	// constructor(wsUrl="ws://myfickle.cn:1234/ws",rollingTime=11){
	constructor(wsUrl="ws://myfickle.cn:1234/flow",rollingTime=11){
		this.wsUrl = wsUrl;
		this.rollingTime=rollingTime;
		this.ws = null;
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
	    	let message = analyis.receiveMessage( e );
	    };
	    
	    ws.onerror = function(e) {
	      	onError(e.data);
	    };
	    this.ws = ws;
		return ws;
	}


	sendMessage(dv,times=0){
		// console.log(this.ws.readyState);
		if( this.ws.readyState ===1 ){
			this.ws.send(dv);
			return true;
		}
		else{
			if(times==10){
				return false;
			}
			let that = this;
			window.setTimeout(function() {that.sendMessage(dv,++times);},200);
		}
	}
}



//when socket is open
function onOpen(e){
	console.log("websocket connected succeed!!");
}

//when socket is close
function onClose(e){
	console.log("websocket closed succeed!!");
}

//when socket is error
function onError(e){
	console.log("Socket error code: "+e.code);
	console.log("Socket error: "+e.data);
}