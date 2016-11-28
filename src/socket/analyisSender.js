// /* analyising the send message of websocket
// ** date:11/14/2016
// ** author:yummyLcj
// */

import gamemodel from "../model/gamemodel"
import dataview from "./dataview.js"
import * as receiver from "./analyisReceiver.js"

let debug = false;

function analyisUnnumber(obj){
	//get a array for name coding by Unicode
	let getObj = obj.split("").map( (e)=>e.codePointAt(0) );
	//you can get name by getObj.map( (e)=>fromCodePoint(e) )
	// if(debug)
	// 	console.log(returnObj);
	return getObj;
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
// 	attackDir : 32,
// 	state : 8
// 	localtionCurrent : {
// 		x : 16,
// 		y : 16
// 	}
// }
// 216+lengthOfName*8
// */
// //calculcate length of balls
function calculcateBallsLength(balls){
	balls = balls.filter( (e)=>typeof(e)!="undefined" );
	let length = balls.length;
	let totalLength = 0;
	for(let i=0;i<length;i++){
		let nameLength = balls[i].name.length;
		totalLength = totalLength+216+nameLength*8;
	}
	return totalLength;
}

// //fill information to dataview
function fillDv(message){
	let dv = new dataview(message.length);
	let length = Number.parseInt(message.length);
	let timestamp = message.timestamp*1000000;
	//temporaryly use ns;
	// let timestamp = message.timestamp;
	let type = Number.parseInt(message.type);
	dv.push32(length);
	dv.pushFloat64(timestamp);
	dv.push8(type);
	switch( type ){
		case 8 :
			fillDisconnectForDv(dv,message.body);
			break;
		case 9 :
			fillConnectForDv(dv,message.body);
			// console.log(dv.getDetail())
			break;
		case 12 :
			// console.log(dv.getDetail());
			fillGroundForDv(dv,message.body);
			break;
	}
	// if(debug)
		// consoledv(dv);
	return dv;
}

function fillDisconnectForDv(dv,body){
	let uerId = Number.parseInt(body.userId);
	// let roomNumber = body.roomNumber;
	let roomNumber = 1;
	dv.push32(userId);
	dv.push32(roomNumber);
}

// //fill connection message body to DataView
function fillConnectForDv(dv,body){
	let userId = body.userId;
	let roomNumber = body.roomNumber;
	dv.push32(userId);
	dv.push32( roomNumber );

}

// //fill balls message to DataView 
function fillBallArrayToDv(dv,content){
	// content = content.filter( (e)=>typeof(e)!="undefined" )
	let length = content.length;
	for( let i=0;i<length;i++ ){
		dv.push32(content[i].camp);
		dv.push32( content[i].userId);
		dv.push16( content[i].id);
		dv.push8( content[i].name.length );
		let name = analyisUnnumber( content[i].name );
		for(let i in name){
			dv.push8( name[i] );
		}
		dv.push8( content[i].ballType );
		dv.push8( content[i].hp );
		dv.push8( content[i].damage );
		dv.push8( content[i].roleId );
		dv.push16( content[i].special );
		dv.push8( content[i].speed );
		dv.pushFloat32( content[i].attackDir );
		//temporaryly use this until ball.js is changed!
		let alive = content[i].alive;
		let status = !content[i].alive;
		dv.push8( status );
		//use this when ball.js is changed
		// dv.push8(content[i].status);
		dv.push16( content[i].locationCurrent.x );
		dv.push16( content[i].locationCurrent.y );
	}
}

// //fill collision messages to dv
function fillCollisionArrayToDv(dv,content){

	let length = content.length;
	for( let i=0;i<length;i++ ){
		dv.push32( content[i].collision1[0] );
		dv.push16( content[i].collision1[1] );
		dv.push32( content[i].collision2[0] );
		dv.push16( content[i].collision2[1] );
		dv.push8( content[i].damageValue[0] );
		dv.push8(content[i].damageValue[1] );
		//temporary use this before damageInfo isn't changed
		dv.push8( content[i].isAlive[0] );
		dv.push8( content[i].isAlive[1] );
		//use this when damageInfo is changed
		//dv.push8(cotnent[i].state[0]);
		//dv.push8(cotnent[i].state[1]);
	}
}

// //fill background message body to DataView
function fillGroundForDv(dv,body){
	let length = body.newBallsInfos.length;
	let content = body.newBallsInfos.content;
	if(debug){
		// console.log("newball content : "+length)
		// console.log(content);
	}
	dv.push32(length);
	fillBallArrayToDv(dv,content);
	length = body.displacementInfos.length;
	content = body.displacementInfos.content;
	if(debug){
		// console.log("displace content : "+length)
		// console.log(content);
	}
	dv.push32(length);
	fillBallArrayToDv(dv,content);
	length = body.collisionSocketInfos.length;
	content = body.collisionSocketInfos.content;
	if(debug){
		// console.log(" collision content : "+length)
		// console.log(content);
	}
	dv.push32(length);
	fillCollisionArrayToDv(dv,content);
	length = body.disappperInfos.length;
	content = body.disappperInfos.content;
	if(debug){
		// console.log("disappear ontent : "+length)
		// console.log(content);
	}
	dv.push32(length);
	for(let i=0;i<length;i++){
		dv.push16(content[i]);
	}
}



// export function disconnectAnalyis(){
// 	let messageBody = {
// 		userId : airplane.userId,
// 		roomNumber : 1
// 	}
// 	let messageLength = (32+64+8+64+8+32+32)/8;
// 	let message = {
// 		length : messageLength,
// 		timestamp : new Date().getTime(),
// 		type : 8,
// 		body : messageBody
// 	}
// 	if(debug){
// 		console.log("disconnect message : ")
// 		console.log(message);
// 	}
// 	return fillDv(message);
// }

// //analyis the information of login
export function loginAnalyis(roomNumber){
	let messageBody = {
		// userId : gamemodel.data.engineControlData.airPlane.userId,
		userId : receiver.userId,
		//32  4
		roomNumber : roomNumber,
		//32   4
	}
	let messageLength = (32+64+8+32+32)/8;
	if(debug){
	console.log("login length : "+messageLength);		
	}

	let message = {
		length : messageLength,
		//32    4
		timestamp : new Date().getTime(),
		// timestamp : 1476691109753,
		//64    8
		type : 9,
		//8    1
		body : messageBody
	}
	if(debug){
		console.log("login message : ")
		console.log(message);
	}
	return fillDv(message);
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
// 	state : [Astate,Bstate] (8,8)
// }
// total:128
// */

export function playgroundInfoAnalyis(){
	let socketCache = gamemodel.socketCache;

	let newBallsInfoArray = socketCache.newBallInformation;
	let lengthOfNewBallsInfos = newBallsInfoArray.length;

	let balls = gamemodel.data.engineControlData;
	let displacementInfoArray = [];
	Array.prototype.push.apply(displacementInfoArray, balls.bullet);
	displacementInfoArray.push(balls.airPlane);
	displacementInfoArray = displacementInfoArray;
	let lengthOfDisplacementInfos = displacementInfoArray.length;
	if( typeof(socketCache.damageInformation)=="undefined")
		socketCache.damageInformation==[];
	let collisionSocketInfoArray = socketCache.damageInformation;
	socketCache.damageInformation = [];
	//clear socket
	let lengthOfCollisionSocketInfos = collisionSocketInfoArray.length;

	let disappearInfoArray = socketCache.disapperBulletInformation;
	let lengthOfDisappearInfos = disappearInfoArray.length;

	// if(debug){
	// 	console.logbackendControlData("balls length : "+calculcateBallsLength(newBallsInfoArray)+"  "
	// +calculcateBallsLength(displacementInfoArray));
	// }

	let length = 32+32+32+32+calculcateBallsLength(newBallsInfoArray)
	+calculcateBallsLength(displacementInfoArray)+lengthOfCollisionSocketInfos*128
	+lengthOfDisappearInfos*16;

	let messageLength = (32+64+8+length)/8;

	if(debug){
		// console.log("groundLength : "+ messageLength);
		// console.log(calculcateBallsLength(displacementInfoArray))
	}

	let messageBody = {
		newBallsInfos : {
			length : lengthOfNewBallsInfos,
			content : newBallsInfoArray
		},
		displacementInfos : {
			length : lengthOfDisplacementInfos,
			content : displacementInfoArray
		},
		collisionSocketInfos : {
			length : lengthOfCollisionSocketInfos,
			content : collisionSocketInfoArray
		},
		disappperInfos : {
			length : lengthOfDisappearInfos,
			content : disappearInfoArray
		}
	}
		let message = {
		length : messageLength,
		//32
		timestamp : new Date().getTime(),
		//64
		type : 12,
		//8
		body : messageBody
	}
	if(debug){
		// console.log("playground message : ")
		// console.log(message);
	}
	return fillDv(message);
}
