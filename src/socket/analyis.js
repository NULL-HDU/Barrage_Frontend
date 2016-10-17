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
    console.log(str);
	return str;
}

//reverse a string
function reverseString(str){
	return str.split("").reverse().join("");
}

//fill information to DataView
function fillDw(dw,content,end){
	content = reverseString(content);
	let length = content.length;
	while(length--){
		dw.setUint8(end--,content[length]);
	}
}

function analyisName(name){
	//get a array for name coding by Unicode
	let getName = name.split("").map( (e)=>e.codePointAt(0) ).map( (e)=>e.toString() );
	//you can get name by getName.map( (e)=>fromCodePoint(e) )
	let returnName = getName.map( (obj)=>"0".repeat(8-obj.length)+obj).toString();
	return returnName;
}

//fill connection information to DataView
function fillConnectForDw(dw,body){
	let userId = body.userId.toString(2);
	let lengthOfName = body.nickname.lengthOfName.toString(2);
	let name=analyisName(body.nickname.name);
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
	let timestamp = message.timestamp.toString(2);
	let type = message.type.toString(2);
	fillDw(dw,length,31);
	fillDw(dw,timestamp,95);
	fillDw(dw,type,103);
	switch( type ){
		case "1001" :
			fillConnectForDw(dw,message.body);
			break;
	}
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
		//63
		type : 9,
		//8
		body : messageBody
	}
	consoleDw(toBinary(message));
	return toBinary(message);
}