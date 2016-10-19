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
		// let message = analyis.receiveMessage( ws.getWsMessage() );
		let message = analyis.receiveMessage( "00000000000000000000000100010000000000000000000000000001010101111101000111001001011011011111101100001001000000000000000000000000000000000000000000000000000000000000000000000111010000010111001001110100011010000111010101110010011110010000000000000000000000000000000000000000" );
		// if(message!=null)
		console.log("message : ")
		console.log(message);
	}

}