/*
* analyis the message from server or cliet
* author:yummyLcj
* email:luchenjiemail@gmail.com
*/

import gamemodel from "../model/gamemodel"


// let message={
// 			length : "",
// 			timestamp : "",
// 			type : "",
// 			body : ""
// 			}

//if debug
let debug = true;

// function consoleDv(dv){
//     var str = ""
//     for(var i=0;i<dv.byteLength;i++){
//     	var char = dv.getUint8(i);
//     	if(char.length<2){
//     		char = "0"+char;
//     	}
//     	str=str+char+" ";
//     }
//     console.log(str.replace(/\s/g, ""));
// 	return str;
// }

//reverse a string
function reverseString(str){
	// return str.split("").reverse();
	return str.split("").reverse().join("");
}

function analyisUnnumber(obj){
	//get a array for name coding by Unicode
	let getObj = obj.split("").map( (e)=>e.codePointAt(0) );
	//you can get name by getObj.map( (e)=>fromCodePoint(e) )
	// if(debug)
	// 	console.log(returnObj);
	return getObj;
}




//send


//fill ball message to DataView 
//return the length of message
function fillBallToDv(dv,content,start=13){
	dv.setUint32(start,content.camp);
	dv.setUint32( (start+4),content.userId);
	dv.setUint16( (start+8),content.id);
	lengthOfName = content.name.length;
	dv.setUint8( (start+10),lengthOfName );
	let name = analyisUnnumber(content.name);
	for(let i in name){
		dv.setUint8( (start+11+i),name[i]);
	}	
	dv.setUint8( (start+lengthOfName+11),content.ballType );
	dv.setUint8( (start+lengthOfName+12),content.hp );
	dv.setUint8( (start+lengthOfName+13),content.damage );
	dv.setUint8( (start+lengthOfName+14),content.roleId );
	dv.setUint16( (start+lengthOfName+15),content.special );
	dv.setUint8( (start+lengthOfName+17),content.speed );
	dv.setUint16( (start+lengthOfName+18),content.attackDir );
	dv.setUint8( (start+lengthOfName+20),content.alive );
	dv.setUint8( (start+lengthOfName+21),content.isKilled );
	dv.setUint8( (start+lengthOfName+22),content.localtionCurrent.x );
	dv.setUint8( (start+lengthOfName+23),content.localtionCurrent.y );
	return (208+lengthOfName*8)/8;
}

//fill background message body to DataView
function fillgroundForDv(dv,body){
	let length = body.collisionSocketInfos.lengthOfCollisionSocketInfos;
	dv.setUint32(13,length);
	let content = body.collisionSocketInfos.collisionSocketInfoArray;
	//total : 144
	for(let i=0;i<length;i++){
		dv.setUint32( (17+i*144) , content[i].collision1[0] );
		dv.setUint16( (21+i*144) , content[i].collision1[1] );
		dv.setUint32( (23+i*144) , content[i].collision2[0] );
		dv.setUint16( (27+i*144) , content[i].collision2[1] );
		dv.setUint8( (29+i*144) , content[i].damageValue[0] );
		dv.setUint8( (30+i*144), content[i].damageValue[1] );
		dv.setUint8( (31+i*144) , content[i].isAlive[0] );
		dv.setUint8( (32+i*144), content[i].isAlive[1] );
		dv.setUint8( (33+i*144), content[i].willDisappear[0]);
		dv.setUint8( (34+i*144), content[i].willDisappear[1]);
	}
	let start = 17+length*144;
	length = body.displacementInfos.lengthOfDisplacementInfos;
	content = body.displacementInfos.displacementInfoArray;
	//total : 
	dv.setUint32(start,length);
	start+=4;
	for(let i=0;i<length;i++){
		let lengthOfBall = fillBallToDv(dv,content[i],start);
		start+=lengthOfBall;
	}
	length = body.newBallsInfos.lengthOfNewBallsInfos;
	content = body.newBallsInfos.newBallsInfoArray;
	dv.setUint32(start,length);
	start+=4;
	for(let i=0;i<length;i++){
		let lengthOfBall = fillBallToDv(dv,content[i],start);
		start+=lengthOfBall;
	}
}

//fill connection message body to DataView
function fillConnectForDv(dv,body){
	let userId = body.userId;
	let lengthOfName = body.nickname.lengthOfName;
	let name=analyisUnnumber(body.nickname.name);
	let roomNumber = body.roomNumber;
	// let troop = body.troop.toString(2);
	let troop = 0;
	dv.setUint32(13,userId);
	dv.setUint8(17,lengthOfName);
	for(let i in name){
		dv.setUint8( (18+i),name[i] );
	}
	dv.setUint32( (18+lengthOfName),roomNumber );
	dv.setUint8( (22+lengthOfName),troop );
}

// function setUint64(dv,byteOffset,content){
// 	dv.setUint32(byteOffset,content>>32);
// 	dv.setUint32(byteOffset+4,content&0XFFFFFFFF);
// 	return dv;
// }

//fill information to dataview
function fillDv(message){
	let buffer = new ArrayBuffer(message.length);
	let dv = new DataView(buffer);
	let length = message.length;
	let timestamp = message.timestamp;
	// console.log("timestamp : "+timestamp);
	let type = message.type;
	// console.log("type : "+type);
	dv.setUint32(0,length);
	dv.setFloat64(4,timestamp);
	dv.setUint8(12,type);
	switch( type ){
		case 9 :
			fillConnectForDv(dv,message.body);
			break;
		case 7 :
			fillgroundForDv(dv,message.body);
			break;
	}
	// if(debug)
		// consoledv(dv);
	return dv;
}

//analyis the information of login
export function loginAnalyis(airplane){
	
	let messageBody = {
		userId : airplane.id,
		//64
		nickname : {
			lengthOfName : airplane.name.length,
			//8
			name : airplane.name
			//length*8
		},
		roomNumber : 0,
		//32
		troop : airplane.camp
		//8
	}
	let messageLength = 32+64+8+64+8+messageBody.nickname.lengthOfName*8+32+8;

	let message = {
		length : messageLength,
		//32
		timestamp : new Date().getTime(),
		// timestamp : 1476691109753,
		//63
		type : 9,
		//8
		body : messageBody
	}
	if(debug){
		console.log("login message : ")
		console.log(message);
	}
	return fillDv(message);
}


export function playgroundInfoAnalyis(){
	let messageBody = {};
	messageBody.collisionSocketInfos={};
	messageBody.displacementInfos={};
	messageBody.newBallsInfos={};
	messageBody.collisionSocketInfos.lengthOfCollisionSocketInfos=gamemodel.socketCache.damageInformation.length;
	messageBody.collisionSocketInfos.collisionSocketInfoArray = gamemodel.socketCache.damageInformation;
	messageBody.displacementInfos.lengthOfDisplacementInfos = gamemodel.data.engineControlData.bullet.length;
	messageBody.displacementInfos.displacementInfoArray = gamemodel.data.engineControlData.bullet;
	messageBody.newBallsInfos.lengthOfNewBallsInfos = gamemodel.socketCache.newBallInformation.length;
	messageBody.newBallsInfos.newBallsInfoArray = gamemodel.socketCache.newBallInformation;
	let messageLength = 32+64+8+64+8;
		let message = {
		length : messageLength,
		//32
		timestamp : new Date().getTime(),
		//63
		type : 7,
		//8
		body : messageBody
	}
	if(debug){
		console.log("playground message : ")
		console.log(message);
	}
	return fillDv(message);
}



//receive






//fill userid information to message;
function userIdToMes(dv){
	gamemodel.data.engineControlData.airPlane.userId = dv.getUint32(13);
	gamemodel.data.engineControlData.airPlane.camp = dv.getUint32(13);
	return { userId : dv.getUint32(13)};
}


//fill connection information to message
function connectToMes( dv ){
	let userId = dv.getUint32(13);
	let lengthOfName = dv.getUint8(17);
	let name = "";
	for(let i=0;i<lengthOfName;i++){
		name+=dv.getUint8(18+i).toString();
	}
	let roomNumber = dv.getUint32(18+lengthOfName);
	let troop = dv.getUint8(22+lengthOfName);	
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


/*collisionSocketInfo={
	ballA : {
		userId : 32,
		id : 16
	},
	ballB : {
		userId : 32,
		id : 16
	}
	damage : [damageToA,damageToB],(8,8)
	isAlive : [AIsAlive,BIsAlive],(8,8)
	willDisappear(AWillDisappear,BWillDisappear) (8,8)
}
total:144
*/
//fill collisionInfo to collisionInfos
function fillCollToColls(dv,length){
	let collisionInfos = [];
	for(let i=0;i<length;i++){
		let collisionInfo = {};
		collisionInfo.ballA.userId = dv.getUint32(17+i*144);
		collisionInfo.ballA.id = dv.getUint16(21+i*144);
		collisionInfo.ballB.userId = dv.getUint32(23+i*144);
		collisionInfo.ballB.id = dv.getUint16(27+i*144);
		damageToA = dv.getUint8(29+i*144);
		damageToB = dv.getUint8(30+i*144);
		collisionInfo.damage = [damageToA,damageToB];
		AIsAlive = dv.getUint8(31+i*144);
		BIsAlive = dv.getUint8(32+i*144);
		collisionInfo.isAlive(AIsAlive,BIsAlive);
		AWillDisappear = dv.getUint8(33+i*144);
		BWillDisappear = dv.getUint8(34+i*144);
		collisionInfo.willDisappear = [AWillDisappear,BWillDisappear];
		collisionInfos.push(collisionInfo);
	}
	return collisionInfos;
}


/*ball={
	camp(userId) : 32,
	ballId : {
		userId : 32,
		id : 16
	},
	nickname : {
		lengthOfName : 8,
		name : lengthOfName*8
	},
	ballType : 8,
	hp : 8,
	damage : 8,
	role : 8,
	special : 16,
	speed : 8,
	attackDir : 16,
	alive : 8,
	isKilled : 8,
	localtionCurrent : {
		x : 16,
		y : 16
	}
}
208+lengthOfName*8
*/
//fill ball information to message
//return the length(208+8*lengthOfName) of ball message
function fillBallToMes(dv,start=13){
	let ball={};
	ball.camp = dv.getUint32(start);
	ball.ballId.userId = dv.getUint32(start+4);
	ball.ballId.id = dv.getUint16(start+8);
	ball.nickname.lengthOfName = dv.getUint8(start+10);
	for(let i=0;i<ball.nickname.lengthOfName;i++){
		ball.nickname.name+=dv.getUint8(start+11+i).toString();
	}
	let go_on = start+11+ball.nickname.lengthOfName*8;
	ball.ballType = dv.getUint8(go_on);
	ball.hp = dv.getUint8(go_on+1);
	ball.damage = dv.getUint8(go_on+2);
	ball.role = dv.getUint8(go_on+3);
	ball.special = dv.getUint16(go_on+4);
	ball.speed = dv.getUint8(go_on+6);
	ball.attackDir = dv.getUint16(go_on+7);
	ball.alive = dv.getUint8(go_on+9);
	ball.isKilled = dv.getUint8(go_on+10);
	ball.localtionCurrent.x = dv.getUint16(go_on+11);
	ball.localtionCurrent.y = dv.getUint16(go_on+13);
	return [ball, (208+ball.nickname.lengthOfName*8)/8 ];
}

//fill displacement information to displacements
//return the end place of the message
function fillPlaceToPlaces(dv,start,length){
	let nextPlace = start;
	let displacementInfos = [];
	while(length--){
		[ displacementInfo,length ] = fillBallToMes(dv,nextPlace);
		displacementInfos.push(displacementInfo);
		nextPlace +=length;
	}
	return [displacementInfos,nextPlace]
}

//fill playground information to message
function groundToMes(dv){
	let lengthofCollision = dv.getUint32(13);
	let collisionInfos = fillCollToColls(dv,lengthofCollision);lengthOfDisplacementInfos
	let displacementStart = 17+lengthofCollision*144;
	let lengthOfDisplacementInfos = dv.getUint32(displacementStart);
	let [ displacementInfos,nextStart ]= fillPlaceToPlaces(dv,displacementStart+4,lengthOfDisplacementInfos);
	let lengthOfNewBallsInfos = dv.getUint32(nextStart);
	let [newBallsInfos,] = fillBallToMes(dv,nextStart+4);
	return {
		collisionSocketInfos : {
			lengthOfCollisionSocketInfos : lengthOfCollisionSocketInfos,
			collisionSocketInfoArray : collisionInfos
		},
		displacementInfos : {
			lengthOfDisplacementInfos : lengthOfDisplacementInfos,
			displacementInfoArray : displacementInfos
		},
		newBallsInfos : {
			lengthOfNewBallsInfos : lengthOfNewBallsInfos,
			newBallsInfoArray : newBallsInfos
		}
	};
}

function overToMes(dv){
	return dv.getUint8(13);
}

//analyis receiving massage
export function receiveMessage(message){
	let dv = new DataView(message.data)
	let length = dv.getUint32(0);
	let timestamp = dv.getFloat64(4);
	let type = dv.getUint8(12);
	switch( type ){
		case 212 :
			var body = userIdToMes( dv );
			break;
		case 6 :
			var [body,] =  fillBallToMes(dv) ;
			break;
		case 7 :
			var body = groundToMes(dv);
			break;
		case 9:
			var body = connectToMes( dv );
			break;
		case 11:
			var body = overToMes(dv);
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