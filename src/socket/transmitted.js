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
		this.status = false
		this.socketStatusSwitcher = this.socketStatusSwitcher.bind(this);
		this.initSocket = this.initSocket.bind(this);
		this.connect = this.connect.bind(this);
		this.playgronud = this.playgroundInfo.bind(this);
	}

	//switch the status of is updating socket
	socketStatusSwitcher(){
		this.status = !this.status;
		return this.status;
	}

	initSocket(callback){
		let userId = receiver.userId;
		if(userId==undefined){
			console.log("reload userId!")
			setTimeout(()=>this.initSocket(callback),100);
		}else{
			callback(null,userId);
		}
	}

	//send login message
	connect(roomNumber,callback){
		let message = sender.loginAnalyis(roomNumber);
		if( this.ws.sendMessage(message.getDv()) ){
			console.log(receiver.state)
			if(receiver.state==2){
				// if(debug)
					console.log("load send succeed!");
				callback(null,true);				
			}else{
				console.log("load send failed...reloading...");
				setTimeout(()=>this.connect(roomNumber,callback),100);
			}
		}
	}

	//analyis receiving message
	playgroundInfo(){
		if(this.status==false){
			let play = setTimeout(()=>this.playgroundInfo(),rollingTime );
		}else{
			// if(debug)
				console.log("playgronud send!");
			let message = sender.playgroundInfoAnalyis();
			if( this.ws.sendMessage(message.getDv()) ){
				// if(debug)
					// console.log("playgronud send succeed!");
			}else{
				  console.log("playgronud send failed...");
			}
			let play = setTimeout(()=>this.playgroundInfo(),rollingTime );
		}
	}
}
