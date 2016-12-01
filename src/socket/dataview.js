/* create a class to resolve dataview
** date:11/14/2016
** author:yummyLcj
*/

let debug = false;
export default class dataview{
	constructor( para=0 ){
		let type = typeof(para);
		this.dvLength = 0;
		this.head = 0;
		this.dv = null;
		switch (type) {
			case "object" :
				this.dvLength = Number.parseInt(para.byteLength);
				this.head = 0;
				this.dv = new DataView( para );
				break;
			case "number" :
				this.dvLength = para;
				this.head = 0;
				this.dv = new DataView( new ArrayBuffer(para) );
				break;
			default :
				console.log("illegal parameter for DataView!!!")
		}
		if(debug){
			console.log("creat dv : ");
			console.log(this.dv);
		}
	}

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

	getDv(){
		return this.dv;
	}

	isEnough(needLength){
		if( (this.dvLength-this.head)<needLength ){
      return false;
		}
		else{
			this.head +=needLength;
		}
		if(debug){
			// console.log("need length : ");
			// console.log(needLength);
			// console.log("dvLength : ");
			// console.log(this.dvLength);
		}
		
	}

	pop8(){
		this.isEnough(1);
		let returnElement = this.dv.getUint8(this.head-1);
		return returnElement;
	}

	pop16(){
		this.isEnough(2);
		let returnElement = this.dv.getUint16(this.head-2);
		return returnElement;
	}

	pop32(){
		this.isEnough(4);
		let returnElement = this.dv.getUint32(this.head-4);
		return returnElement;
	}

	popFloat32(){
		this.isEnough(4);
		let returnElement = this.dv.getFloat32(this.head-4);
		return returnElement;
	}

	popFloat64(){
		this.isEnough(8);
		let returnElement = this.dv.getFloat64(this.head-8);
		return returnElement;
	}

	isLegal(needLength,content){
		if( this.dvLength-this.head<needLength ){
      return false;
		}
		if( typeof(content)!="number" && typeof(content)!="undefined" &&typeof(content)!="boolean" ){
      return false;
		}
		// console.log("daHas : "+this.head);
		this.head +=needLength;
	}

	push8(content){
		this.isLegal(1,content);
		this.dv.setUint8( this.head-1,content );
	}

	push16(content){
		this.isLegal(2,content);
		this.dv.setUint16( this.head-2,content );
	}

	push32(content){
		this.isLegal(4,content);
		this.dv.setUint32( this.head-4,content );
	}

	pushFloat32(content){
		this.isLegal(4,content);
		this.dv.setFloat32( this.head-4,content );
	}

	pushFloat64(content){
		this.isLegal(8,content);
		this.dv.setFloat64( this.head-8,content );
	}
}
