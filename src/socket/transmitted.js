/*
*send message to server
*author:yummyLcj
*email:luchenjiemail@gmail.com
*/

import WebSocket from "./websocket.js";
import gamemodel from "../model/gamemodel.js" 
import * as sender from "./analyisSender.js"

let debug = false;
let rollingTime = 1000;

export default class transmitted{

	constructor(){
		this.ws = new WebSocket();
		this.ws.init();
	}

	//send login message
	login(airplane){
		let message = sender.loginAnalyis(airplane);
		if( this.ws.sendMessage(message.getDv()) ){
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
		if( this.ws.sendMessage(message.getDv()) ){
			if(debug)
				console.log("playgronud send succeed!");
		}else{
			console.log("playgronud send failed...");
		}
		// setTimeout(this.playgroundInfo(),rollingTime );
	}
		
}
