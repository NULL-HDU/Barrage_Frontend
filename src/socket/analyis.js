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

function consoleDw(dw){
    var str = ""
    for(var i=0;i<dw.byteLength;i++){
    	var char = dw.getUint8(i);
    	if(char.length<2){
    		char = "0"+char;
    	}
    	str=str+char+" ";
    }
    console.log(str.replace(/\s/g, ""));
	return str;
}

//reverse a string
function reverseString(str){
	// return str.split("").reverse();
	return str.split("").reverse().join("");
}

//fill information to DataView
function fillDw(dw,content,end){
	// content = reverseString(content);
	let length = content.length;
	while(length--){
		dw.setUint8(end--,content[length]);
	}
}

function analyisUnnumber(obj){
	//get a array for name coding by Unicode
	let getObj = obj.split("").map( (e)=>e.codePointAt(0) ).map( (e)=>e.toString(2) );
	//you can get name by getObj.map( (e)=>fromCodePoint(e) )
	let returnObj = getObj.map( (e)=>"0".repeat(8-e.length)+e).join('');
	// if(debug)
	// 	console.log(returnObj);
	return returnObj;
}

//fill connection message body to DataView
function fillConnectForDw(dw,body){
	let userId = body.userId.toString(2);
	let lengthOfName = body.nickname.lengthOfName.toString(2);
	console.log("lengthOfName : "+lengthOfName);
	let name=analyisUnnumber(body.nickname.name);
	let roomNumber = body.roomNumber.toString(2);
	// let troop = body.troop.toString(2);
	let troop = "0";
	let nameEnd = 175+body.nickname.lengthOfName*8;
	fillDw(dw,userId,167);
	fillDw(dw,lengthOfName,175);
	fillDw(dw,name,nameEnd);
	fillDw(dw,roomNumber,nameEnd+32);
	fillDw(dw,troop,nameEnd+40);
}

//transfrom message to binary
function toBinary(message){
	let buffer = new ArrayBuffer(message.length);
	let dw = new DataView(buffer);
	let length = message.length.toString(2);
	// console.log("length : "+length)
	let timestamp = message.timestamp.toString(2);
	// console.log("timestamp : "+timestamp);
	let type = message.type.toString(2);
	// console.log("type : "+type);
	fillDw(dw,length,31);
	fillDw(dw,timestamp,95);
	fillDw(dw,type,103);
	switch( type ){
		case "1001" :
			fillConnectForDw(dw,message.body);
			break;
	}
	// if(debug)
		// consoleDw(dw);
	return dw;
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
	return toBinary(message);
}




//receive



//change connecting information to decimal
function connectToDec(message){
	let body = {};
	body.userId = toDecimal( message.slice(0,64) );
	body.nickname = {};
	body.nickname.lengthOfName = toDecimal( message.slice(64,72) );
	let nameEnd = 72+body.nickname.lengthOfName*8;
	body.nickname.name = toDecimal( message.slice(72,nameEnd) );
	body.roomNumber = toDecimal( message.slice(nameEnd,nameEnd+32) );
	body.troop = toDecimal( message.slice(nameEnd+32,nameEnd+40) );
	return body;
}

function toDecimal(message){
	return Number.parseInt(message,2);
}

//analyis receiving massage
export function receiveMessage(message){
	let length = toDecimal( message.slice(0,32) );
	let timestamp = toDecimal( message.slice(32,96) );
	let type = toDecimal( message.slice(96,104) );
	switch( type ){
		case 9 :
			var body = connectToDec( message.slice(104,message.length) );
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