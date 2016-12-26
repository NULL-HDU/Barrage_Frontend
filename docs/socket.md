#socket
##socket传输数据格式
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

#####构造函数
通过初始化时传进来的参数（长度或dataview）进行判断，可新创建dataview，或通过已有的dataview来穿件dataview。新创建的用来向里面写入东西，已有的用来读数据。
#####读函数
通过get方法和head来读数据，同时判断head是否会超过dvlength，读后head向前移
如：

    pop8(){
		this.isEnough(1);
		let returnElement = this.dv.getUint8(this.head-1);
		return returnElement;
	}
	
#####存函数
通过set方法和head来存数据，同时判断head是否会超过dvlength，存后head向前移
如：

    push8(content){
		this.isLegal(1,content);
		this.dv.setUint8( this.head-1,content );
	}

###解析数据
在将传过来的二进制数据收取完成后，通过制定的格式来拆封各个数据，通过头的type字段来判断传递的数据的数据格式，来确认具体解析方法。
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

###解析数据具体完成方法举例

####场地信息
收到场地信息后，将ball的信息由array转化为json

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

然后将gamemodel的airplace与bullet去除，遍历，通过userId与id在json中查找元素，若不存在则从gamemodel删除，存在则更新。

    unction writeTobackendControlData(message) {
	if (times++ === 0) {
		writeNewBallInf(message);
		return;
	}
  message = arrayToJson(message);
  let backend = gamemodel.data.backendControlData;
	let airPlane = backend.airPlane;
	let bullet = backend.bullet;
  let disappear = gamemodel.disappearCache;
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

同时需要注意的是，应为用in遍历，所有不能直接更新gamemodel的整个数组，用filter来过去数组，完成所需的任务。