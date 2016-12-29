# websocket

标签（空格分隔）： 期末总结

---
#socket
##socket传输数据格式
为了尽量解决网速慢的问题，减少数据的传输量，因此采用二进制来传输数据
###dataview
双方数据为二进制，websocket的binaryType为arraybuffer，js新建dataview来传输二进制。

###封装dataview

####dataview对于本系统的不足
js自带的dataview需制定下标来存/取，不利于代码的修改与版本更新，因此重新将dataview自带的api封装来方便代码的修改。

####封装后dataview的设计
模仿栈的实现,实现先进先出，并且为了适应dataview的存取方法，因此为了能存取不同的位数，需要封装多个方法

####属性
- dv - dataview的内容，原dataview
- dvLength - dv的长度
- head - dv的头指正

####方法

#####**构造函数**
通过初始化时传进来的参数（长度或dataview）进行判断，可新创建dataview，或通过已有的dataview来穿件dataview。新创建的用来向里面写入东西，已有的用来读数据。
#####**读函数**
通过get方法和head来读数据，同时判断head是否会超过dvlength，读后head向前移
如：

    pop8(){
		this.isEnough(1);
		let returnElement = this.dv.getUint8(this.head-1);
		return returnElement;
	}
	
#####**存函数**
通过set方法和head来存数据，同时判断head是否会超过dvlength，存后head向前移
如：

    push8(content){
		this.isLegal(1,content);
		this.dv.setUint8( this.head-1,content );
	}

#####**读dataview**
一字节一字节的读dv，来获取dv的所有二进制内容

    getDetail(){
		var str = ""
    	for(var i=0;i<this.dv.byteLength;i++){
	    	var char = this.dv.getUint8(i).toString(16);
	    	if(char.length<2){
	    		char = "0"+char;
	    	}
	    	str=str+char+" ";
	    	// str+=char;
	    }
		return str;
	}

###解析数据
因为传递过来的数据的具体内容不可预知，因此需要加一个固定格式的数据头来定义具体的内容信息
在将传过来的二进制数据收取完成后，通过指定的格式来拆封各个数据，通过头的type字段来判断传递的数据的数据格式，按照固定的位数来确认具体解析方法。
如：

    export function receiveMessage(message) {
	let dv = new dataview(message.data);
	let length = dv.pop32();
	let timestamp = dv.popFloat64();
	let type = dv.pop8();
	let body = "Sorry!!!I can't analyis!!!";
	switch (type) {
		case 212:
			body = userIdToMes(dv);
			break;
		case 6:
			body = fillConnectToMes(dv);
			break;
		case 7:
			// case 12 :
			body = groundToMes(dv);
			gamemodel.collisionCache = body.collisionSocketInfosArray;
			writeTobackendControlData(body.displacementInfoArray);
			writeNewBallInf(body.newBallsInfoArray);
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

###解析数据完成后操作

####场地信息
解析场地信息后，将collision直接写入到gamemodel，从gamemodel中更新newBall和displacement信息

#####**newBall更新gamemodel**
在写入newBall的同时，根基roldId给每个ball分配相应的skinId

    function writeNewBallInf(newBall) {
	let backend = gamemodel.data.backendControlData;
	let bullet = gamemodel.resourceRecord.bulletTable;
	let airPlane = gamemodel.resourceRecord.airPlaneTable;
	for (let i in newBall) {
		let roleId = newBall[i].roleId;
		let skinId = null;
		if (newBall[i].ballType === CommonConstant.AIRPLANE) {
			skinId = airPlane[roleId]["skinId"];
		} else {
			skinId = bullet[roleId]["skinId"];
		}
		newBall[i]["skinId"] = skinId;
		if (newBall[i].userId == 0) {
			backend.food.push(newBall[i]);
		} else {
			if (newBall[i].id == 0) {
				backend.airPlane.push(newBall[i]);
			} else {
				backend.bullet.push(newBall[i]);
			}
		}
	}
}

#####**displacement更新gamemodel**
将displacement的信息由array转化为json，然后将gamemodel的airplace与bullet去除，遍历，通过userId与id在json中查找元素，若不存在则从gamemodel删除，存在则更新。

并且为了解决初始化时没有newBall，因此第一次应将displacement中的信息加入到newBall中。

    function arrayToJson(arr) {
	if( /\[(\.*:{.*\})*\]/.test( JSON.stringify(arr) ) ){
    console.error(arr)
	console.error("is illegal!!");
	return undefined;
	}
	let json = {};
	for (let i in arr) {
		let userId = arr[i]["userId"];
		let id = arr[i]["id"];
		if (json[userId] === undefined)
			json[userId] = {};
		json[userId][id] = arr[i];

	}
	return json;
    }  
    
通过正则表达式来判断是否正确，然后将array转换用userId和id作为key的json

    function writeTobackendControlData(message) {
	if (times++ === 0) {
		writeNewBallInf(message);
		return;
	}
	message = arrayToJson(message);
	let backend = gamemodel.data.backendControlData;
	let airPlane = backend.airPlane;
	let bullet = backend.bullet;
	let disappear = gamemodel.disappearCache;
	// let block = backend.block;
	backend.airPlane = airPlane.filter((ap) => {
		let userId = ap.userId;
		if (message[userId] != undefined && message[userId][0] != undefined) {
			Object.assign(ap, message[userId][0]);
			return true;
		}

		disappear.push(ap);
		return false;
	});

	backend.bullet = bullet.filter((b) => {
		let userId = b.userId;
		let id = b.id;
		if (message[userId] != undefined && message[userId][id] != undefined) {
			Object.assign(b, message[userId][id]);
			return true;
		}

		disappear.push(b);
		return false;
	});
}

同时需要注意的是，应为用in遍历，所有不能直接更新gamemodel的整个数组，用filter来过去数组，完成所需的任务。不可用assign更新整个数组。

####登陆信息
解析成功以后，向airPlace中写入获得的userId，并将socket状态改为申请登陆(1)

####成功登陆
解析成功以后，将socket状态改为成功登陆(2)

为防止在获得id或者登陆成功之前进行下一步骤，因此添加了状态量

####错误信息
解析成功以后，将二进制转化为文字并输出

    function specialToMes(dv) {
	let length = dv.pop8();
	let body = "";
	for (let i = 0; i < length; i++) {
		let letter = String.fromCodePoint(dv.pop8());
		body = body + letter;
	}
	return body;
}

String.fromCodePoint是es6的新方法

###发送信息
获取要发送的信息后，根据不同的信息，准备不同的type，并计算对应的信息长度，然后根据不同的type将信息写入dataview

####socket send函数封装
为了确保socket send时在连接状态，因此封装了send函数

	sendMessage(dv, times = 0) {
		// console.log(this.ws.readyState);
		if (this.ws.readyState === 1) {
			this.ws.send(dv);
			return true;
		} else {
			if (times == 10) {
				return false;
			}
			let that = this;
			window.setTimeout(function() {
				that.sendMessage(dv, ++times);
			}, 200);
		}
	}
	
####写入头数据

#####**场地信息**

    export function playgroundInfoAnalyis() {
	let socketCache = gamemodel.socketCache;
	let newBallsInfoArray = socketCache.newBallInformation;
	socketCache.newBallInformation = [];
	let lengthOfNewBallsInfos = newBallsInfoArray.length;

	let balls = gamemodel.data.engineControlData;
	let displacementInfoArray = [];
	Array.prototype.push.apply(displacementInfoArray, balls.bullet);
	if (balls.airPlane != undefined)
		displacementInfoArray.push(balls.airPlane);
	let lengthOfDisplacementInfos = displacementInfoArray.length;
	if (typeof(socketCache.damageInformation) == "undefined")
		socketCache.damageInformation == [];
	let collisionSocketInfoArray = socketCache.damageInformation;
	socketCache.damageInformation = [];
	let lengthOfCollisionSocketInfos = collisionSocketInfoArray.length;

	let disappearInfoArray = socketCache.disapperBulletInformation;
	socketCache.disapperBulletInformation = [];
	let lengthOfDisappearInfos = disappearInfoArray.length;
	let messageBody = {
		newBallsInfos: {
			length: lengthOfNewBallsInfos,
			content: newBallsInfoArray
		},
		displacementInfos: {
			length: lengthOfDisplacementInfos,
			content: displacementInfoArray
		},
		collisionSocketInfos: {
			length: lengthOfCollisionSocketInfos,
			content: collisionSocketInfoArray
		},
		disappperInfos: {
			length: lengthOfDisappearInfos,
			content: disappearInfoArray
		}
	}
	let length = 32 + 32 + 32 + 32 + calculcateBallsLength(newBallsInfoArray) + calculcateBallsLength(displacementInfoArray) + lengthOfCollisionSocketInfos * 128 + lengthOfDisappearInfos * 16;

	let messageLength = (32 + 64 + 8 + length) / 8;
	let message = {
		length: messageLength,
		timestamp: new Date().getTime(),
		type: 12,
		body: messageBody
	}
	return fillDv(message);
}

需要注意的是，在读的过程中读完cache需要重新初始化，并且每个ball的长度不一定，需要通过name的长度计算。

#####**计算ball长度**

    function calculcateBallsLength(balls) {
	balls = balls.filter((e) => typeof(e) != "undefined" && !(e === null));
	let length = balls.length;
	let totalLength = 0;
	for (let i = 0; i < length; i++) {
		let nameLength = balls[i].name.length;
		totalLength = totalLength + 224 + nameLength * 8;
	}
	return totalLength;
}

#####**登陆信息**

    export function loginAnalyis(roomNumber) {
	let messageBody = {
		userId: receiver.userId,
		roomNumber: roomNumber,
	}
	let messageLength = (32 + 64 + 8 + 32 + 32) / 8;
	let message = {
		length: messageLength,
		timestamp: new Date().getTime(),
		type: 9,
		body: messageBody
	}
	return fillDv(message);
}

####写入头文件完成之后操作
通过不同type对应的model来填写dataview
如：

#####**写入newBall**

    function fillBallArrayToDv(dv, content) {
	let length = content.length;
	for (let i = 0; i < length; i++) {
		dv.push32(content[i].camp);
		dv.push32(content[i].userId);
		dv.push16(content[i].id);
		dv.push8(content[i].name.length);
		let name = analyisUnnumber(content[i].name);
		for (let i in name) {
			dv.push8(name[i]);
		}
		dv.push8(content[i].ballType);
		dv.push8(content[i].hp);
		dv.push8(content[i].damage);
		dv.push8(content[i].roleId);
		dv.push16(content[i].special);
		dv.push16(content[i].radius || 15);
		dv.pushFloat32(content[i].attackDir);
		dv.push8(content[i].status);
		dv.push16(content[i].locationCurrent.x);
		dv.push16(content[i].locationCurrent.y);
	}
}

#####**将非数字转化为数字**

    function analyisUnnumber(obj) {
	//get a array for name coding by Unicode
	let getObj = obj.split("").map((e) => e.codePointAt(0));
	//you can get name by getObj.map( (e)=>fromCodePoint(e) )
	return getObj;
	}