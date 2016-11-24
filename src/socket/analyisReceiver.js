/* analyising the receive message of websocket
** date:11/14/2016
** author:yummyLcj
*/

import gamemodel from "../model/gamemodel"
import dataview from "./dataview.js"

let debug = false;

// function writeTobackendControlData(message){
// 	if(debug){
// 		console.log("write message : ");
// 		console.log(message);	
// 	}
// 	let airPlane = [];
// 	let bullet = [];
// 	let block = [];
// 	for(let i in message){
// 		if( message[i].ballType=="airPlane" ){
// 			airPlane.push(message[i]);
// 			continue;
// 		}
// 		if( message[i].ballType=="bullet" ){
// 			bullet.push(message[i]);
// 			continue;
// 		}
// 		if( message[i].ballType=="block" ){
// 			block.push(message[i])
// 			continue;
// 		}
// 		else{
// 			console.log("undefined type!!");
// 		}
// 	}
// 	let backendControlData = gamemodel.data.backendControlData;
// 	// backendControlData.airPlane.push(airPlane);
// 	// backendControlData.bullet.push(bullet);
// 	// backendControlData.block.push(block);
// }

//analyis receiving massage
export function receiveMessage(message){
	let dv = new dataview(message.data);
	let length = dv.pop32();
	let timestamp = dv.popFloat64();
	let type = dv.pop8();
	let body = "Sorry!!!I can't analyis!!!";
	switch( type ){
		case 212 :
			 body = userIdToMes(dv);
			break;
		case 6 :
			body =  fillBallToMes(dv);
			// gamemodel.data.engineControlData.airPlane = body;
			break;
		case 7 :
			body = groundToMes(dv);
			// let socketCache = gamemodel.socketCache;
			// socketCache.newBallInformation = body.newBallsInfoArray;
			// socketCache.damageInformation = body.collisionSocketInfosArray;
			// gamemodel.disappearCache = body.disappearInfoArray;
			// writeTobackendControlData(body.displacementInfoArray);
			break;
		case 9:
			body = connectToMes(dv);
			break;
		case 10:
		 body = specialToMes(dv);
			break;
		case 11:
		 body = overToMes(dv);
			break;

	}

	let returnMessage = {
		length : length,
		timestamp : timestamp,
		type : type,
		body : body
	}

	if(debug){
		console.log("receive message : ");
		console.log(returnMessage);
	}
	return returnMessage;
}

// //fill userid information to message;
// //tempaoraryly cmap equal to userId!!
function userIdToMes(dv){
	let airplane = gamemodel.data.engineControlData.airPlane;
	airplane.userId = airplane.camp = dv.pop32();
	return { userId : airplane.userId};
}


// /*ball={
// 	camp(userId) : 32,
// 	ballId : {
// 		userId : 32,
// 		id : 16
// 	},
// 	nickname : {
// 		lengthOfName : 8,
// 		name : lengthOfName*8
// 	},
// 	ballType : 8,
// 	hp : 8,
// 	damage : 8,
// 	role : 8,
// 	special : 16,
// 	speed : 8,
// 	attackDir : 16,
// 	alive : 8,
// 	isKilled : 8,
// 	localtionCurrent : {
// 		x : 16,
// 		y : 16
// 	}
// }
// 208+lengthOfName*8
// */
// //fill ball information to message
function fillBallToMes(dv){
	let ball={};
	ball.camp = dv.pop32();
	ball.userId = dv.pop32();
	ball.id = dv.pop16();
	let lengthOfName = dv.pop8();
	ball.name = "";
	for(let i=0;i<lengthOfName;i++){
		// ball.nickname.name+=dv.pop8().toString();
		ball.name += String.fromCodePoint(dv.pop8());
	}
	ball.ballType = dv.pop8();
	ball.hp = dv.pop8();
	ball.damage = dv.pop8();
	ball.roleId = dv.pop8();
	ball.special = dv.pop16();
	ball.speed = dv.pop8();
	ball.attackDir = dv.pop16();
	//tmporaryly use this when ball.js isn't changed
	let status = dv.pop8();
	ball.alive = (status==0);
	ball.isKilled = !ball.alive;
	//use this when ball.js is changed
	// ball.status = dv.pop8();
	ball.locationCurrent = {};
	ball.locationCurrent.x = dv.pop16();
	ball.locationCurrent.y = dv.pop16();
	return ball;
}

// /*collisionSocketInfo={
// 	ballA : {
// 		userId : 32,
// 		id : 16
// 	},
// 	ballB : {
// 		userId : 32,
// 		id : 16
// 	}
// 	damage : [damageToA,damageToB],(8,8)
// 	isAlive : [AIsAlive,BIsAlive],(8,8)
// 	willDisappear(AWillDisappear,BWillDisappear) (8,8)
// }
// total:144
// */
// //make collisionInfo to a array
function getCollisionInfoToArray(dv,length){
	let collisionInfos = [];
	while(length--){
		let collisionInfo = {};
		let AUserId = dv.pop32();
		let AId = dv. pop16();
		let BUserId = dv.pop32();
		let BId = dv.pop16(); 
		collisionInfo.collision1 = [AUserId , AId];
		collisionInfo.collision2 = [BUserId, BId];
		let damageToA = dv.pop8();
		let damageToB = dv.pop8();
		collisionInfo.damage = [damageToA,damageToB];
		let AIsAlive = dv.pop8();
		let BIsAlive = dv.pop8();
		collisionInfo.isAlive = [AIsAlive,BIsAlive];
		let AWillDisappear = dv.pop8();
		let BWillDisappear = dv.pop8();
		collisionInfo.willDisappear = [AWillDisappear,BWillDisappear];
		collisionInfos.push(collisionInfo);
	}
	return collisionInfos;
}

// //make balls information to a array
function getBallsInfoArray(dv,length){
	let newBallsInfoArray = [];
	let newBallsInfo = {};
	while(length--){
		newBallsInfo = fillBallToMes(dv);
		newBallsInfoArray.push(newBallsInfo);
	}
	return newBallsInfoArray;
}

function getDisplacementinfoToArray(dv,length){
	let displacementInfoArray = [];
	while(length--){
		displacementInfoArray.push(dv.pop16());
	}
	return displacementInfoArray;
}

// //fill playground information to message
function groundToMes(dv){
	let lengthOfNewBallsInfos = dv.pop32();
	let newBallsInfoArray = getBallsInfoArray(dv,lengthOfNewBallsInfos);
	let lengthOfDisplacementInfos = dv.pop32();
	let displacementInfoArray = getBallsInfoArray(dv,lengthOfDisplacementInfos);
	let lengthOfCollisionSocketInfos = dv.pop32();
	let collisionSocketInfoArray = getCollisionInfoToArray(dv,lengthOfCollisionSocketInfos);
	let lengthOfDisappearInfos = dv.pop32();
	let disappearInfoArray = getDisplacementinfoToArray(dv,lengthOfDisappearInfos);
	return {
		lengthOfNewBallsInfos : lengthOfNewBallsInfos,
		newBallsInfoArray : newBallsInfoArray,

		lengthOfDisplacementInfos : lengthOfDisplacementInfos,
		displacementInfoArray : displacementInfoArray,

		lengthOfCollisionSocketInfos : lengthOfCollisionSocketInfos,
		collisionSocketInfos : collisionSocketInfoArray,

		lengthOfDisappearInfos : lengthOfDisappearInfos,
		disappearInfoArray : disappearInfoArray
	}
}

// //fill connection information to message
function connectToMes( dv ){
	let userId = dv.pop32();
	let lengthOfName = dv.pop8();
	let name = "";
	for(let i=0;i<lengthOfName;i++){
		name+=String.fromCodePoint(dv.pop8());
	}
	let roomNumber = dv.pop32();
	let troop = dv.pop8();
	return {
		userId : userId,
		nickname : {
			lengthOfName : lengthOfName,
			name : name
		},
		roomNumber : roomNumber,
		troop : troop
	};
}

function specialToMes(dv){
	let length = dv.pop8();
	let body = "";
	for(let i=0;i<length;i++){
		let letter = String.fromCodePoint(dv.pop8());
		body=body+letter;
	}
	return body;
}

function overToMes(dv){
	return dv.pop8();
}