# bullet

## Introduction

bullet 表示一个子弹对象，每个玩家通过操纵 airplane 发射子弹相互攻击进行游戏。

bullet 能够相互抵消。每个 bullet 对象都有血条（hp），子弹间相互碰撞会减少双方的hp，减少的值为对方的hp（血条即伤害），hp为0的 bullet 会死去（DEAD）。

bullet 碰撞到敌方 airplane 时， airplane 被杀死（DEAD），同时该 bullet 对象也会消失（DISAPPEAR）。

bullet 拥有射程，当 bullet 移到射程外时，该 bullet 会消失（DISAPPEAR）。但是跟随 father 的子弹没有射程（不考虑射程），当 father 消失或死亡时，该子弹也消失或死亡。

现在，每个 bullet 都是圆形的，用 radius 属性表示其半径大小，之后可以考虑把子弹变成椭圆形，而用长半径作为半径来创建子弹的包围体进行碰撞检测。

## Implement

### Composition Elements

bullet 由三部分组成：

- **base data**， bullet 的一些基本数据，包括 hp，speed 等
- **skin**， bullet 的皮肤，这个部分告诉 view 层如何绘制该 bullet
- **pathFunc**， bullet 的运行轨迹，该部分会生成一个函数来描述 在engine每次循环中bullet的位置变化情况

#### Base Data

bullet 继承自 ball，它拥有所有 ball 的基本属性。

bullet 额外的属性：

```javascript
{
     roleId:       Number,             // 子弹角色，它暗示子弹的skin与pathFunc
     skinId:       Number,             // 子弹皮肤，view 会根据该值绘制该子弹 
     radius:       Number,             // 子弹半径，子弹的skin_radius就是radius
     hp:           Number,             // 子弹血条
     range:        Number,             // 子弹射程
     oSpeed:       Number,             // 创建子弹时，作为参数的子弹速度，单位：px / s
     speed:        Number,             // 子弹速度，单位：px / GLI
     attackDir:    Number,             // 子弹被发射时的方向, 0 ~ 2PI
     srclocation:  PVector,            // 子弹被发射时的位置，用于计算子弹已移动的位移
     run:          Function,           // 一个返回一个PVector对象的函数
     father:       Bullet | Airplane,  // 该子弹的父亲，通过实现子弹家族树来实现子弹跟随
     following:    Boolean,            // 表示子弹是否跟随其father
     dLocation:    PVector,            // 上一次引擎运行时，run 函数调用的结果，用于实现子弹跟随
}
```

*其中 GLI 是`GAME_LOOP_INTERVAL`，表示两次引擎运转的间隔时间，该常量在`src/global.js`中定义*

#### Skin

```javascript
{
    skin: Array<String>,    // 子弹图片路径
    camp: [String, String], // 该数组中的String用于区分敌我双方，第一个为己方，第二个为敌方 
}
```

这些Skin数据写在 `src/resource/skin/skin.js` 中：

```javascript
import {
    BULLET1,
    ...
} from "../skin/skinId.js";

const RP = "/static/view/imgs/";
let IMG_MIN_BULLET = RP + "MIN_BULLET.png",
    MIN_B = RP + "MIN_B.png",
    MIN_R = RP + "MIN_R.png";

export const bulletSkins = {
    [BULLET1]: {
        skin: [IMG_MIN_BULLET],
        camp: [MIN_B, MIN_R]
    },
    ...
};
```

bulletSkins 是一个以skinId为键，skin数据为值的字典对象。该对象会在 GamemodelInit() 时被添加进gamemodel，通过`gamemodel.resourceRecord.skinTable.bullet`访问。

view 在绘制子弹时，会先读取其 skinId ，在 gamemodel.resourceRecord.skinTable.bullet 中找到 skin 数据，然后根据它绘制和bullet的skin_radius绘制。

#### pathFunc

pathFunc 的类型为 `(Bullet, ...) -> () -> PVector`, 它们的格式应遵循：

```javascript
export const xxxPath = (bullet, other_parameters) => {

    /* do some init */

    return () => {
        /* calculate dLocation */
        return dLocation;
    };
};
```

这些path函数会被写入到 `src/resource/bullet/bullet_role.js` 中，因为定义一种子弹，需要子弹皮肤与子弹运行函数：

```javascript
import {BULLET1} from "../skin/skinId.js";
import {STRAIGHT_LINE_BULLET} from "./roleId.js";
import straightLinePath from "../pathFunc/straightLine.js";

export default {
  [STRAIGHT_LINE_BULLET]: {
      skinId: BULLET1,
      pathFunc: straightLinePath,
  }
}
```

上述对象是一个以roleId为键，role为值的字典对像。该对象会在 GamemodelInit() 时被添加进gamemodel，通过`gamemodel.resourceRecord.bulletTable`访问。

子弹在被创建时，子弹有一个pathFunc属性（具体请看 bullet lifecycle # create），此时需要通过以下方式给 bullet.run 赋值：

        bullet.run = bullet.pathFunc(bullet, otherParamters...);
        
bullet.pathFunc 的第一个参数是 bullet 自身，其他参数根据不同 pathFunc 而不同。而 bullet.run 会在每次 bullet 计算自己的位置时被调用（具体请看 bullet lifecycle # run）。

### Bullet LifeCycle

#### create

bullet 的构造函数签名为：`constructor(Bullet, Number, Object)`

其中，第一个参数会被赋值到新的bullet的father属性，第二个会被赋值到新的bullet的roleId。

构造函数会根据roleId去查找`gamemodel.resourceRecord.bulletTable`，得到相应的role对象，再通过一下方式，将role对象合并到bullet：

        Object.assign(this, gamemodel.resourceRecord.bulletTable[roleId]);
        
*因此，创建完成的bullet对象会有相应 role 的全部属性。*

第三个参数是其他基本数据:

```javascript
{
     radius:       Number,             // 子弹半径，子弹的skin_radius就是radius
     hp:           Number,             // 子弹血条
     range:        Number,             // 子弹射程
     oSpeed:       Number,             // 创建子弹时，作为参数的子弹速度，单位：px / s
     attackDir:    Number,             // 子弹被发射时的方向, 0 ~ 2PI
     srclocation:  PVector,            // 子弹被发射时的位置，用于计算子弹已移动的位移
     following:    Boolean,            // 表示子弹是否跟随其father
}
```

该参数同样会通过 Object.assign 合并到 bullet 对象自身。

构造函数会通过 oSpeed 的值计算 speed 属性的值，locationCurrent属性的值与srclocation相同，而skin_radius的值与radius的值相等。

最后，构造函数会将创建完成的 bullet push进 `gamemodel.socketCache.newBallInformation`。

**在bullet对象创建完毕后，还需要调用 bullet.pathFunc 函数，并将返回值赋值给 bullet.run**

#### run

bullet.locationCurrent 表示 bullet 的当前为止，bullet.pathCalculate 函数会根据 bullet.run 的返回值修改 bullet.locationCurrent 的值，以实现 bullet 的移动。 (bullet.pathCalculate 在每次引擎运行中都会被调用。)

在 bullet.pathCalculate 中，bullet.run 会被调用，并用返回值更新 bullet.dLocation 的值，然后 bullet.locationCurrent 会加上 bullet.dLocation 作为其新值。

如果 bullet.following 为true，则 bullet.locationCurrent 还会加上 bullet.father.dLocation 作为其新值，以实现子弹跟随效果。否则，bullet.pathCalculate 会通过 locationCurrent 和 srclocation 属性对 bullet 做射程判断，如果超出射程，则该球会消失（DISAPPEAR）。

最后，bullet.pathCalculate 会做边界检测，超出边界的 bullet 会消失。

#### DEAD or DISAPPEAR

DEAD 条件：

- 碰撞检测（collisionDetection）时，发现 bullet 对象的 hp 值小于等于 0。

DISAPPEAR 条件：

- bullet 在移动（bullet.pathCalculate）时，超出射程或超出边界。
- 碰撞检测（collisionDetection）时，发现 bullet 碰撞到敌方飞机。
- bullet 子弹跟随时，bullet.father 消失或死亡。

以上消失和死亡都仅仅是将 bullet.state 设置为 DISAPPEAR 或 DEAD，bullet 对象被真正地从gamemodel.data移除是在 uselessBulletsCollect 。

uselessBulletsCollect 会将 state 值为非 ALIVE 都从 gamemodel.data 中移除，放入 gamemodel.deadCache | disappearCache 中。

### Bullet Event

bullet 事件机制，之后预计会做。

bullet 需要多个事件钩子函数：

```javascript
onCollisionWithEnemy( enemyBall )

onCollisionWithFamily( familyBall )

onCollisionWithWall( WallIndex )        // WallIndex: 上右下左  == 0123

onDeath()

onDisappear()

onKillEnemy( enemyBall )
```




