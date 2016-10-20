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
<<<<<<< HEAD
		// let message = analyis.receiveMessage( this.ws.getWsMessage() );
=======
		// let message = analyis.receiveMessage( ws.getWsMessage() );
>>>>>>> 1fe88c8415096a7f7b08546b4dedf1efcce345d8
		// if(message!=null)
		console.log("message : ")
		// console.log(message);
	}

}
