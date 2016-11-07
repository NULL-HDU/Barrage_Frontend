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
			console.log("load send succeed!");
		}else{
			return false;
			console.log("load send failed...");
		}
	}

	//analyis receiving message
	playgroundInfo(){
		console.log("playgronud send!");
		let message = analyis.playgroundInfoAnalyis();
		if( this.ws.sendMessage(message) ){
			return true;
			console.log("playgronud send succeed!");
		}else{
			return false;
			console.log("playgronud send failed...");
		}
	}

}
