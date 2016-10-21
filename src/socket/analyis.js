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
let debug = 1;

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
	if(debug)
		console.log(message);
	return fillDv(message);
}




//receive






//fill userid information to message;
function userIdToMes(dv){
	gamemodel.data.engineControlData.airPlane.userId = dv.getUint32(13);
	return { userId : dv.getUint32(13)};
}

function connectToMes( dv ){
	let userId = dv.getUint32(13);
	let lengthOfName = dv.getUint8(17);
	let name = "";
	for(let i=0;i<lengthOfName;i++){
		name+=dv.getUint8(18+i);
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
		case 9:
			var body = connectToMes( dv );
			break;
	}

	let returnMessage = {
		length : length,
		timestamp : timestamp,
		type : type,
		body : body
	}
	if(debug)
		console.log(returnMessage);
	return returnMessage;
}