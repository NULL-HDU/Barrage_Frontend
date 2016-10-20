/*
*send message to server
*author:yummyLcj
*email:luchenjiemail@gmail.com
*/

import WebSocket from "./websocket.js";
import gamemodel from "../model/gamemodel.js" 
import * as analyis from "./analyis.js"

export default class transmitted{

	constructor(){
		this.ws = new WebSocket();
		this.ws.init();
	}

	//send login message
	login(airplane){
		let message = analyis.loginAnalyis(airplane);
		if( this.ws.sendMessage(message) ){
			return true;
			console.log("send succeed!");
		}else{
			return false;
			console.log("send failed...");
		}
	}

	//analyis receiving message
	communitate(airplane){
		// let message = analyis.receiveMessage( this.ws.getWsMessage() );
		// if(message!=null)
		console.log("message : ")
		console.log(message);
	}

}