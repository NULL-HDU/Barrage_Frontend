/* create a class to resolve dataview
** date:11/14/2016
** author:yummyLcj
*/
export default class dataview{
	construct( para==0 ){
		let type = typeof(para);
		switch (type) {
			case "object" :
				this.dvLength = dv.dvHas = para.byteLength;
				this.dv = para;
				break;
			case "number" :
				this.dvLength = para;
				this.dvHas = 0;
				this.dv = new DataView( new ArrayBuffer(para) );
				break;
			default :
				console.log("illegal parameter for DataView!!!")
		}
	}

	getDv(){
		return this.dv;
	}

	isEnough(needLength){
		if(this.dvHas<needLength){
			console.log("DataView isn't lont enough to push!!!");
			return false;
		}
		else{
			this.dvHas -=needLength;
			this.dvLength -=needLength;
		}
	}

	pop8(){
		isEnough(1);
		let temDv = new DataView( new Arraybuffer(this.dvLength) );
		for(let i=0;i<this.dvLength-1;i++){
			temDv.setUint8( i, this.dv.getUint8(i+1) );
		}
		let returnElement = this.dv.getUint8(0);
		this.dv = temDv;
		return returnElement;
	}

	pop16(){
		isEnough(2);
		let temDv = new DataView( new Arraybuffer(this.dvLength) );
		for(let i=0;i<this.dvLength-2;i++){
			temDv.setUint8( i, this.dv.getUint8(i+2) );
		}
		let returnElement = this.dv.getUint16(0);
		this.dv = temDv;
		return returnElement;
	}

	pop32(){
		isEnough(4);
		let temDv = new DataView( new Arraybuffer(this.dvLength) );
		for(let i=0;i<this.dvLength-4;i++){
			temDv.setUint8( i, this.dv.getUint8(i+4) );
		}
		let returnElement = this.dv.getUint32(0);
		this.dv = temDv;
		return returnElement;
	}

	popFloat64(){
		isEnough(8);
		let temDv = new DataView( new Arraybuffer(this.dvLength) );
		for(let i=0;i<this.dvLength-8;i++){
			temDv.setUint8( i, this.dv.getUint8(i+4) );
		}
		let returnElement = this.dv.getFloat64(0);
		this.dv = temDv;
		return returnElement;
	}

	isLegal(needLength,content){
		if( this.dvLength-this.dvHas<needLength ){
			console.log("DataView isn't long enough to push!!!")
			return false;
		}
		if( typeof(content)!="number" ){
			console.log("type of content isn't legal!!");
			console.log("your type is "+typeof(content));
			return false;	
		}
		this.dvHas +=needLength;
	}

	push8(content){
		isLegal(1,content);
		this.dv.setUint8( this.dvHas-1,content );
	}

	push16(content){
		isLegal(2,content);
		this.dv.setUint16( this.dvHas-2,content );
	}

	push32(content){
		isLegal(4,content);
		this.dv.setUint8( this.dvHas-4,content );
	}

	pushFloat64(content){
		isLegal(8,content);
		this.dv.setFloat64( this.dvHas-8,content );
	}

}