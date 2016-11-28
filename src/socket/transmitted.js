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
let rollingTime = 1000/90;

export default class transmitted{

	constructor(){
		this.ws = new WebSocket();
		this.ws.init();
	}

	initSocket(callback){
		let userId = receiver.userId;
		if(userId==undefined){
			setTimeout(()=>{this.initSocket(callback)},100);
		}else{
			callback(null,userId);
		}
	}

	//send login message
	connect(roomNumber,callback){
		let message = sender.loginAnalyis(roomNumber);
		if( this.ws.sendMessage(message.getDv()) ){
			if(debug)
				console.log("load send succeed!");
			if(receiver.state==2){
				callback(null,true);				
			}
		}else{
			console.log("load send failed...reloading...");
			setTimeout(()=>{this.connect(roomNumber,callback)},100);
		}
	}

	//analyis receiving message
	playgroundInfo(){
		// if(debug)
			// console.log("playgronud send!");
		let message = sender.playgroundInfoAnalyis();
		if( this.ws.sendMessage(message.getDv()) ){
			// if(debug)
				// console.log("playgronud send succeed!");
		}else{
			  // console.log("playgronud send failed...");

		console.log("asd")
		}
		let play = setTimeout(()=>this.playgroundInfo(),rollingTime );
	}
}
