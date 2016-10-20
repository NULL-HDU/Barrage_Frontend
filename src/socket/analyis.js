/*
* analyis the message from server or cliet
* author:yummyLcj
* email:luchenjiemail@gmail.com
*/

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
	let nameEnd = 175+lengthOfName*8;
	setUint64(dv,13,userId);
	dv.setUint8(21,lengthOfName);
	for(i in name){
		dv.setUint8( (22+i),name[i] );
	}
	dv.setUint32( (22+lengthOfName),roomNumber );
	dv.setUint8( (26+lengthOfName),troop );
}

functino setUint64(dv,byteOffset,content){
	dv.setUint32(byteOffset,content>>32);
	dv.setUint32(byteOffset+4,content&0XFFFFFFFF);
	return dv;
}

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
	dv.setUint64(4,dv,timestamp);
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
		body : messag10000eBody
	}
	if(debug)
		console.log(message);
	return fillDv(message);
}




//receive



//change connecting information to decimal
function userIdToMes(dv){
	return { userId : getUint64(dv,13)};
}

function getUint64(dv,byteOffset){
	let first32 = dv.getUint32(byteOffset);
	let last32 = dv.getUint32(byteOffset+4);
	return (first32<<32+last32);
}

//analyis receiving massage
export function receiveMessage(message){
	let dv = new DataView(message);
	let length = dv.getUint32(0);
	let timestamp = getUint64(dv,4);
	let type = dv.getUint8(12);
	switch( type ){
		case 212 :
			var body = userIdToMes( dv );
			break;
	}

	let returnMessage = {
		length : length,
		timestamp : timestamp,
		type : type,
		body : body
	}
	return returnMessage;
}