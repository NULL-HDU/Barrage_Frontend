/* create a class to resolve dataview
** date:11/14/2016
** author:yummyLcj
*/

let debug = false;
export default class dataview{
	constructor( para=0 ){
		let type = typeof(para);
		this.dvLength = 0;
		this.dvHas = 0;
		this.dv = null;
		switch (type) {
			case "object" :
				this.dvLength = this.dvHas = Number.parseInt(para.byteLength);
				this.dv = new DataView( para );
				break;
			case "number" :
				this.dvLength = para;
				this.dvHas = 0;
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

	getDv(){
		return this.dv;
	}

	isEnough(needLength){
		if(this.dvHas<needLength){
			console.log("DataView isn't lont enough to pop!!!");
			return false;
		}
		else{
			this.dvHas -=needLength;
			this.dvLength -=needLength;
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
		let temDv = new DataView( new ArrayBuffer(this.dvLength) );
		for(let i=0;i<this.dvLength;i++){
			temDv.setUint8( i, this.dv.getUint8(i+1) );
		}
		let returnElement = this.dv.getUint8(0);
		this.dv = temDv;
		return returnElement;
	}

	pop16(){
		this.isEnough(2);
		let temDv = new DataView( new ArrayBuffer(this.dvLength) );
		for(let i=0;i<this.dvLength;i++){
			temDv.setUint8( i, this.dv.getUint8(i+2) );
		}
		let returnElement = this.dv.getUint16(0);
		this.dv = temDv;
		return returnElement;
	}

	pop32(){
		this.isEnough(4);
		let temDv = new DataView( new ArrayBuffer(this.dvLength) );
		for(let i=0;i<this.dvLength;i++){
			temDv.setUint8( i, this.dv.getUint8(i+4) );
		}
		let returnElement = this.dv.getUint32(0);
		this.dv = temDv;
		return returnElement;
	}

	popFloat64(){
		this.isEnough(8);
		let temDv = new DataView( new ArrayBuffer(this.dvLength) );
		for(let i=0;i<this.dvLength;i++){
			temDv.setUint8( i, this.dv.getUint8(i+8) );
		}
		let returnElement = this.dv.getFloat64(0);
		this.dv = temDv;
		return returnElement;
	}

	isLegal(needLength,content){
		if( this.dvLength-this.dvHas<needLength ){
			console.log("DataView isn't long enough to push!!!")
			console.log("your want to push ");
			console.log(content);
			return false;
		}
		if( typeof(content)!="number" && typeof(content)!="undefined" &&typeof(content)!="boolean" ){
			console.log("type of content isn't legal!!");
			console.log("your type is "+typeof(content));
			console.log(content);
			return false;	
		}
		// console.log("daHas : "+this.dvHas);
		this.dvHas +=needLength;
	}

	push8(content){
		this.isLegal(1,content);
		this.dv.setUint8( this.dvHas-1,content );
	}

	push16(content){
		this.isLegal(2,content);
		this.dv.setUint16( this.dvHas-2,content );
	}

	push32(content){
		this.isLegal(4,content);
		this.dv.setUint32( this.dvHas-4,content );
	}

	pushFloat64(content){
		this.isLegal(8,content);
		this.dv.setFloat64( this.dvHas-8,content );
	}
}