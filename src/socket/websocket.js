/*
*	websocket engine
*	author:yummyLcj
*	email:luchenjiemail@gmail.com
*/

import * as receiver from "./analyisReceiver.js"

let debug = true;

//action for websocket
export default class socket {
	
 	// constructor(wsUrl="ws://139.199.174.225:2333/test"){
  	constructor(wsUrl="ws://192.168.1.100:2334/test"){
		this.wsUrl = wsUrl;
    	this.ws = null;
	}

	setUrl(url){
		this.wsUrl = url;
	}

	getUrl(){
    	return this.wsUrl;
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
	    	let message = receiver.receiveMessage( e );
	    	if(debug){
	    		console.log("recevie message : ");
	    		console.log(message);
	    	}
	    };
	    
	    ws.onerror = function(e) {
	      	onError(e);
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
