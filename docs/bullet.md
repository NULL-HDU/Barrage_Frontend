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

view 在绘制子弹时，会先读取其 skinId ，在 gamemodel.resourceRecord.skinTable.bullet 中找到 skin 数据，然后根据它绘制。


