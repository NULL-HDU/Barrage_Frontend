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
let status = false;

 	//switch the status of is updating socket
export function socketStatusSwitcher(){
		status = !status;
		return status;
	}

export default class transmitted{

	constructor(){
		this.ws = new WebSocket();
		this.ws.init();
		this.status = false
		this.initSocket = this.initSocket.bind(this);
		this.connect = this.connect.bind(this);
		this.playgroundInfo = this.playgroundInfo.bind(this);
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
		if(receiver.state==1){
			this.ws.sendMessage( message.getDv() );
		}
		if(receiver.state==2){
			if(debug)
				console.log("load send succeed!");
			callback(null,true);				
		}else{
			console.log("load send failed...reloading...");
			setTimeout(()=>this.connect(roomNumber,callback),100);
		}
	}

	//analyis receiving message
	playgroundInfo(){
		if(status==false){
			let play = setTimeout(()=>this.playgroundInfo(),rollingTime );
		}else{
			if(debug)
				console.log("playgronud send!");
			let message = sender.playgroundInfoAnalyis();
			if( this.ws.sendMessage(message.getDv()) ){
				if(debug)
					console.log("playgronud send succeed!");
			}else{
				  console.log("playgronud send failed...");
			}
			let play = setTimeout(()=>this.playgroundInfo(),rollingTime );
		}
	}
}
