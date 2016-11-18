/*
*send message to server
*author:yummyLcj
*email:luchenjiemail@gmail.com
*/

import WebSocket from "./websocket.js";
import gamemodel from "../model/gamemodel.js" 
import * as sender from "./analyisSender.js"
import * as receiver from "./analyisReceiver.js"

let debug = false;
let rollingTime = 1000/60;

export default class transmitted{

	constructor(){
		this.ws = new WebSocket();
		this.ws.init();
	}

	//send login message
	login(airplane){
		let message = sender.loginAnalyis(airplane);
		receiver.receiveMessage(message);
		if( this.ws.sendMessage(message) ){
			if(debug)
				console.log("load send succeed!");
			return true;
		}else{
			console.log("load send failed...");
			return false;
		}
	}

	//analyis receiving message
	playgroundInfo(){
		if(debug)
			console.log("playgronud send!");
		let message = sender.playgroundInfoAnalyis();
		if( this.ws.sendMessage(message) ){
			if(debug)
				console.log("playgronud send succeed!");
			return true;
		}else{
			console.log("playgronud send failed...");
			return false;
		}
		setTimeout( playgroundInfo(),rollingTime );
	}

}
