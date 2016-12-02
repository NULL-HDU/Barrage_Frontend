/* analyising the receive message of websocket
** date:11/14/2016
** author:yummyLcj
*/

import Ball from "../model/ball.js";
import gamemodel from "../model/gamemodel";
import dataview from "./dataview.js";
import * as CommonConstant from "../constant.js";

let debug = false;

export let state = 0;
export let userId = undefined;
export let roomNumber = undefined;

//return childItem
function makeItem(item,depth,...key){
	for(let i in key){
		if( item[key[i]]==undefined ){
			throw "item:" +item+ "didn't has "+key[i];
		}
	}
	let json = {};
	if(depth==0)
		return item;
	else{
		json[ item[ key[ (key.length-depth)] ] ] = makeItem(item,--depth,...key);
	}
	return json;
}

//convert array to json and serveral item from array as keys
//function arrayToJson(array,"first key","second key",...)
function arrayToJson(arr,...key){
	let depth = key.length;
	let json = {};
	for(var i in arr){
		if( depth==0 )
			json[i] = arr[i];
		else{
			let d = depth;
			try {
				json[ arr[i][key[0]] ] = makeItem(arr[i],--d,...key) 
				}
			catch (e) {
				console.error(e);
				break;
			}
		}
	}
	return json;
}

function writeTobackendControlData(message){
	message = arrayToJson(message,"userId","id");
	if(debug){
		console.log("write message : ");
		console.log(message);	
	}
	let backend = gamemodel.data.backendControlData;
	let airPlane = backend.airPlane;
	let bullet = backend.bullet;
	// let block = backend.block;
	for(let i in airPlane){
		let userId = airPlane[i].userId;
		if( message[userId]!=undefined && message[userId][0]!=undefined ){
			airPlane[i].assign( message[userId][0] );
		}else{
			delete(airPlane[i]);
		}
	}
	for(let i in bullet){
		let userId = bullet[i].userId;
		let id = bullet[i].id;
		if( message[userId]!=undefined && message[userId][id]!=undefined ){
			bullet[i].assign( message[userId][0] );
		}else{
			delete(bullet[i]);
		}
	}
}

function writeNewBallInf(newBall){
	let backend = gamemodel.data.backendControlData;
	for(let i in newBall){
		if( newBall[i].userId==0 ){
			backend.food.push(newBall[i]);
		}else{
			if(newBall[i].id==0){
				backend.airPlane.push(newBall[i]);
			}else{
				backend.bullet.push(newBall[i]);
			}
		}
	}
}

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
			body =  fillConnectToMes(dv);
			break;
		case 7 :
		// case 12 :
      body = groundToMes(dv);
			gamemodel.collisionCache = body.collisionSocketInfosArray;
			// gamemodel.disappearCache = body.disappearInfoArray;
			writeNewBallInf(body.newBallsInfoArray);
			writeTobackendControlData(body.displacementInfoArray);
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
	// let airplane = gamemodel.data.engineControlData.airPlane;
	userId = dv.pop32();
	state = 1;
	return { userId : userId};
}

function fillConnectToMes(dv){
	// let airPlane = gamemodel.data.engineControlData.airPlane;
	let userId = dv.pop32();
	// airPlane.userId = userId;
	let room = dv.pop32();
	// airPlane.roomNumber = room;
	roomNumber = roomNumber;
	state = 2;
	return {
		userId : userId,
		roomNumber : room
	}
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
// 	radius : 16,
// 	attackDir : 32,
//  state: 8,
// 	localtionCurrent : {
// 		x : 16,
// 		y : 16
// 	}
// }
// 224+lengthOfName*8
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
	ball.radius = dv.pop16();
	ball.attackDir = dv.popFloat32();
	//tmporaryly use this when ball.js isn't changed
  ball.status = dv.pop8();
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
// 	state : [Astate,Bstate]
// }
// total:128
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
		//temporary use this before damageInfo isn't changed
		let Astate = dv.pop8();
		let Bstate =  dv.pop8();
		let AIsAlive = (Astate==0);
		let BIsAlive = (Bstate==0);
		collisionInfo.isAlive = [AIsAlive,BIsAlive];
		let AWillDisappear = !AIsAlive;
		let BWillDisappear = !BIsAlive;
		collisionInfo.willDisappear = [AWillDisappear,BWillDisappear];
		//use this when damageInfo is changed
		//collisionInfo.state=[Astate,Bstate];
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
