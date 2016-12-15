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
let rollingTime = 1000 / 90;
let status = false;
let ws = null;
let status = null;

//switch the status of is updating socket
export default function socketStatusSwitcher() {
	status = !status;
	return status;
}


export default initSocket(callback, times === 0) {
	if (times === 0) {
		ws = new WebSocket();
		ws.init();
	}
	let userId = receiver.userId;
	if (userId == undefined) {
		console.log("reload userId!")
		setTimeout(() => initSocket(callback, 1), 100);
	} else {
		callback(null, userId);
	}
}

//send login message
export default connect(roomNumber, callback, times = 0) {
	let message = sender.loginAnalyis(roomNumber);
	if (receiver.state == 1) {
		if (debug)
			console.log("start loading...");
		if (times == 0)
			ws.sendMessage(message.getDv());
	}
	if (receiver.state == 2) {
		if (debug)
			console.log("load send succeed!");
		callback(null, true);
	} else {
		console.log("load send failed...reloading...");
		setTimeout(() => connect(roomNumber, callback, 1), 100);
	}
}

//analyis receiving message
export default playgroundInfo() {
	if (debug)
		console.log("start send playgroundInfo");
	// if (status == false) {
	// let play = setTimeout(() => this.playgroundInfo(), rollingTime);
	// } else {
	if (debug)
		console.log("playgronud send!");
	let message = sender.playgroundInfoAnalyis();
	if (ws.sendMessage(message.getDv())) {
		if (debug)
			console.log("playgronud send succeed!");
	} else {
		console.log("playgronud send failed...");
	}
	// let play = setTimeout(() => this.playgroundInfo(), rollingTime);
	// }
}
}