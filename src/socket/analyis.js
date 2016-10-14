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

//transfrom message to binary
function toBinary(message){
	dw = new DataView(message.length);
	
}

//analyis the information of login
export function loginAnalyis(airplane){
	
	let messageBody = {
		userId = airplane.id,
		//64
		nickname = {
			lengthOfName = airplane.name.length,
			//8
			name : airplane.name
			//length*8
		},
		roomNumber = 0,
		//32
		troop = airplane.camp
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



}