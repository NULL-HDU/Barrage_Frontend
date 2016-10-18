/** there is tools about point
 *  and Point class self
 *
 *@author MephistoPheies&MIKUMIKU
 */

/*-------------------------------------------------------PVector------------------------------------*/
/**以下定义了向量运算**/

//设定向量
export default function PVector(x, y){
    this.x = x || 0
    this.y = y || 0
}

PVector.prototype.mag = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y)
}

//获取副本
PVector.prototype.get = function () {
    return this;
}

PVector.prototype.add = function (p) {
    if(! p instanceof PVector ) return
    this.x += p.x
    this.y += p.y
}

PVector.prototype.sub = function (p) {
    if(! p instanceof PVector ) return
    this.x -= p.x
    this.y -= p.y
}

//向量乘法
PVector.prototype.mult = function (mulfFactor) {
    this.x *= mulfFactor
    this.y *= mulfFactor
}

//向量除法
PVector.prototype.div = function (divFactor) {
    if(!divFactor){
        var err = "Can't div 0"
        
        throw new Error(err)
    } else {
        this.x /= divFactor
        this.y /= divFactor
    }

}

//设定模长
PVector.prototype.setMag = function (newMag) {
    if( !PVector.mag(this) ){
        this.x= this.y =0
    } else {
        var m = newMag / PVector.mag(this)
        this.mult(m)
    }

}

//限制模长
PVector.prototype.limit = function (limitation) {
    if(mag(this) > limitation ){
        this.setMag(limitation)
    }
}

//向量单位化
PVector.prototype.normalize = function () {
    this.setMag(1.0);

    return this;
}

//向量积
PVector.prototype.dot = function(p) {
    return this.x* p.x + this.y* p.y
}

//计算平面角度
PVector.prototype.heading2D = function () {
    if(!this.x){
        if(!this.y){
            return 0
        }
        if(this.y>0){
            return Math.PI/2
        } else return - Math.PI/2

    }


    if (this.x > 0 ){
        return Math.atan(this.y/this.x)

    } else {

        if(this.y>0){
            return Math.atan(this.y / this.x) + Math.PI

        } else
            return Math.atan(this.y / this.x) - Math.PI
    }
}

/*******************class methon********************/

//向量差
PVector.sub =function(p1, p2) {
    return new PVector(p1.x-p2.x, p1.y-p2.y)
}

//计算模长
PVector.mag= function(p){
    return Math.sqrt(p.x * p.x + p.y * p.y)
}

//向量和
PVector.add = function(p1, p2) {
    return new PVector(p1.x+p2.x, p1.y+p2.y)
}


//计算距离
PVector.dist = function(p1,p2) {
    return PVector.mag(new PVector(p1.x-p2.x, p1.y- p2.y))
}

//计算并得到扩大后的向量
PVector.mult = function (p,mulfFactor) {
    var x = mulfFactor*p.x,
        y = mulfFactor*p.y;

    return new PVector(x,y);


}

PVector.setMag = function (p,newMag) {
    if( !PVector.mag(p) ){
        return new PVector(0,0);
    } else {
        var m = newMag / PVector.mag(p) || 0;
        return PVector.mult(p,m)
    }

}

PVector.normalize =function(p){

    return PVector.setMag(p,1.0);
}
/*--------------------------------------------------------other tool----------------------------------*/

//随机函数
function __Random(m, n){
    return Math.round(Math.random()*(n - m) + m);
}

function __Limit (l, min, max) {
    if(l > max) {
        l = max
    }
    if(l < min) {
        l = min
    }
}
/*------------------------------------------------------------------------------------------*/
window.PVector =PVector;
