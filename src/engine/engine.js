import global from "../engine/global"
import Airplane from "../model/airplane"
import gamemodel from "../model/gamemodel"
import Bullet from "../model/bullet"
import PVector from "../engine/Point"
import Quadtree from "../engine/quadtree"

export function bulletMakerLoop(airPlane,bulletMakerStartFlag){
    setTimeout(function () {
        let bullet = new Bullet();
        bullet.ballType = "Bullet";
        let angel = airPlane.attackDir;
        bullet.camp = 0;
        bullet.locationCurrent.x = airPlane.locationCurrent.x + Math.cos(angel + (3/2)*Math.PI) * 100;
        bullet.locationCurrent.y = airPlane.locationCurrent.y + Math.sin(angel + (3/2)*Math.PI) * 100;
        bullet.startPoint.x = airPlane.locationCurrent.x + Math.cos(angel + (3/2)*Math.PI) * 50;
        bullet.startPoint.y = airPlane.locationCurrent.y + Math.sin(angel + (3/2)*Math.PI) * 50;
        bullet.attackDir = airPlane.attackDir;
        gamemodel.data.engineControlData.bullet.push(bullet);
        if (bulletMakerStartFlag === 0) {
            bulletMakerLoop(airPlane,bulletMakerStartFlag);
        }
    }, global.BULLET_MAKER_LOOP_INTERVAL);
}

export function enableCollisionDetectionEngine(){
    /*
      1.将要检测碰撞的球体加入四叉树
      2.对每个球体进行碰撞检测，检测到的就进行标记
      3.碰撞效果和伤害检测处理之后清空四叉树，进行下一轮碰撞检测
    */
    let selfBullets = gamemodel.data.engineControlData.bullet.concat(airPlane);
    let enemyBullets = gamemodel.data.backendControlData.bullet.concat(gamemodel.data.backendControlData.airPlane);
        let bulletsBank = selfBullets.concat(enemyBullets);
        let i,j;
        quad.clear();
        for(i=0;i<bulletsBank.length;i++){
            quad.insert(bulletsBank[i]);
        }
        i=0;
        while(i < selfBullets.length){
            let collidors = quad.retrieve(selfBullets[i]);
            for(j=0;j<collidors.length;j++){
                if(collidors[j].hasJudge || selfBullets[i] == collidors[j]){
                    continue;
                }
                let a = new PVector(selfBullets[i].locationCurrent.x,selfBullets[i].locationCurrent.y);
                let b = new PVector(collidors[j].locationCurrent.x,collidors[j].locationCurrent.y);
                let distance = PVector.dist(a,b);
                if(distance <= collidors[j].radius + selfBullets[i].radius && collidors[j].camp !== selfBullets[i].camp){

                    //碰撞处理和伤害计算
                    if(collidors[j].ballType === "Bullet"){
                        collidors[j].alive = false;
                        collidors[j].isKilled = true;
                    }

                    if(selfBullets[i].ballType === "Bullet"){
                        selfBullets[i].alive = false;
                        selfBullets[i].isKilled = true;
                    }

                    //不管碰撞的是子弹和子弹，还是子弹和飞机都需要加入碰撞信息中
                    //暂未处理飞机撞击飞机的情况
                    let damageInformation = {
                        collision1:collidors[j].id,
                        collision2:selfBullets[i].id,
                        damageValue:[collidors[j].damageValue,selfBullets[i].damageValue],
                        isAlive:[collidors[j].alive,selfBullets[i].alive],
                        willDisappear:[!collidors[j].alive,!selfBullets[i].alive],
                    };
                    gamemodel.socketCache.damageInformation.push(damageInformation);

                    //只判断两个相撞
                    break;
                }
            }

            selfBullets[i].hasJudge = true;
            i++;
        }
}

