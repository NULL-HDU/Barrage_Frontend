/*
*send message to server
*author:yummyLcj
*email:luchenjiemail@gmail.com
*/

import websocket from "./websocket.js";
import gamemodel from "../model/gamemodel.js" 
import * as analyis from "./analyis.js"

export default class transmitted{
	//send login message
	login(airplane){ 
		let ws = new websocket();
		ws.init();
		let message = analyis.loginAnalyis(airplane);
		if( ws.sendMessage(message) ){
			console.log("send succeed!");
		}else{
			console.log("send failed...");
		}
	}
}