/*
*send message to server
*author:yummyLcj
*email:luchenjiemail@gmail.com
*/

import ws from "./websocket.js";
import gamemodel from "../model/gamemodel.js" 
module analyis from "./analyis.js"

export default class transmitted{
	//send login message
	login(airplane){ 
		let message = analyis.loginAnalyis(airplane);
	}
}