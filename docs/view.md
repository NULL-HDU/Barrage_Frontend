# view

## Introduction

view 的主要作用是读取 game model 中由前端 engine 创造并控制或由 socket 从后端读取并写入的各种 ball 的数据，然后在 canvas 中渲染绘制出来。

view 使用了 pixi.js 这个基于 webGl 技术的 2d 游戏渲染引擎来绘制 game model 中存储的数据。其中 pixi.js 是通过将图片预加载成纹理存储在 cache 中，需要时再构建相应的 sprite 来提高渲染速度的

view 将整个游戏分成了九个 layer，其中 Airplanelayer 是基础，它保证了其它 Layer 中的各种 sprite 在 canvas 中的坐标是以自主机为中心的，即保证自主机在其可见的视野中居中显示

view 绘制 sprite 所使用的皮肤图片纹理 skin 是读取 resource 中的资源管理器存储的图片路径创建的

## Implement

### Composition Elements

view 现阶段主要包含以下四部分

- **scene size**，view 中关于虚拟场景（逻辑规定的敌我双方以及各种子弹、资源、障碍物的行动范围）、截取场景（即自主机的视野范围）、本地场景（即本地浏览器的窗口大小）、VIEW 场景（截取场景在本地场景里通过合适的缩放后的显示）

- **adaptation function**，view 中用于不同的截取场景，在不同的本地场景中使VIEW场景进行适配的函数

- **airplane**，view 中的自主机、观战模式的数据以及相应的设置函数

- **background**，view 中的单 sprite 背景的滚动、以及边界情况的实现

- **select balls**, view 中的 sprite 资源管理函数，主要作用是挑选出处于当前自主机的视野中的己方子弹、敌机、敌机子弹并绘制出来

#### Scene Size

```javascript

// 虚拟场景的宽高是不可变的变量
const VIRTUAL = {
    width: 1280 * 2,
    height: 800 * 2
}

let CUT = {
    // 截取场景的当前帧的宽高， 默认为最大视野，即虚拟场景的宽高
    width: VIRTUAL.width,
    height: VIRTUAL.height,
    
    //  截取场景的上一帧的宽高，用来判断自主机的视野是否改变
    pre: {
        width: VIRTUAL.width,
        height: VIRTUAL.height
    }
}

let LOCAL = {
    // 本地场景当前帧的宽高，即浏览器窗口的可视大小，不包括工具栏
    width: window.innerWidth, 
    height: window.innerHeight,

    // 本地场景的上一帧的宽高，用来判断本地浏览器的窗口大小是否改变
    pre: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    
    // 标识本地场景的 size 是否改变
    flag: false
};

let VIEW = {
    // VIEW 场景的宽高，只有在本地场景或截取场景变化时才能引起变化，初始值为0
    width: 0,
    height: 0,
    center: {x: 0, y: 0},               // VIEW 场景的中心坐标
    side: {left: 0, top: 0},            // canvas 的左边缘与上边缘
    ratio: 1,                           // 当前帧 VIEW 场景与截取场景的比率
    pre: {ratio: 1},                    // 上一帧的比率
    mark: {local: false, cut: false},   // 本地场景或截取场景的变化是否会导致 VIEW 场景的变化的标识
    flag: false                         // 标识 VIEW 场景是否发生了变化
};

```

#### Adaptation Function

主要函数，浏览器窗口的大小即本地场景的变化或截取场景的变化都可能会导致 VIEW 场景的变化

```javascript

function resizeView() {
    // 如果截取场景发生变化，标识
    VIEW.mark.cut = (isCutChanged() === true) ? true : false;

    // 获取当前的浏览器窗口大小
    getLocalSize();
    // 判断是否发生变化
    if (isLocalSizeChanged()) {
        // 判断浏览器窗口变化后 VIEW 场景还适不适配
        VIEW.mark.local = (!isViewFitLocal() === true) ? true : false;
        // 只要浏览器窗口发生变化，就重新使 canvas 置于中心
        centerCanvas();
    } 

    // 截取场景变化或 VIEW 场景不适配浏览器窗口，重新调整 VIEW 场景
    if (VIEW.mark.cut === true || VIEW.mark.local === true) {
        adjustView();
        renderer.resize(VIEW.width, VIEW.height);
        centerCanvas();
        VIEW.flag = true;
    } else {
        VIEW.flag = false;
    }
}

```

获取当前浏览器窗口的大小的函数
```javascript

let getLocalSize = () => {
    // 先保存上一帧的宽高
    LOCAL.pre.width = LOCAL.width;
    LOCAL.pre.height = LOCAL.height;

    // 获得这一帧的宽高
    LOCAL.width = window.innerWidth;
    LOCAL.height = window.innerHeight;
};

```

判断浏览器窗口是否发生改变
```javascript

let isLocalSizeChanged = () => {
    LOCAL.flag = (LOCAL.width !== LOCAL.pre.width || LOCAL.height !== LOCAL.pre.height) ? true : false;
    return LOCAL.flag;
};

```

判断 VIEW 场景是否适配浏览器窗口
```javascript

let isViewFitLocal = () => {

    // 浏览器窗口的宽高都不等于 VIEW 场景的宽高，或某边相等，另一边浏览器窗口的小于 VIEW 场景的
    if (
        (LOCAL.width !== VIEW.width && LOCAL.height !== VIEW.height) ||
        (LOCAL.width === VIEW.width && LOCAL.height < VIEW.height) ||
        (LOCAL.width < VIEW.width && LOCAL.height === VIEW.height)
    ) {
        return false;
    } else {
        return true;
    }
};

```

调整 VIEW 场景
```javascript 

let adjustView = () => {

    // 取最小的比率，这样能保证截取场景按最合适的比率显示成 VIEW 场景
    let w = LOCAL.width / CUT.width, h = LOCAL.height / CUT.height;
    let r = (w <= h) ? w : h;

    VIEW.width = CUT.width * r;
    VIEW.height = CUT.height * r;
    VIEW.center.x = VIEW.width / 2;
    VIEW.center.y = VIEW.height / 2;
    VIEW.pre.ratio = VIEW.ratio;
    VIEW.ratio = VIEW.width / CUT.width;

    // 将浏览器窗口的大小给 MODEL，保证鼠标攻击角度的正确
    MODEL.viewScope.width = LOCAL.width;
    MODEL.viewScope.height = LOCAL.height;
};

```

 让 canvas 处于浏览器窗口中心
 ```javascript 
 
let centerCanvas = () => {
    VIEW.side.left = (LOCAL.width - VIEW.width) / 2;
    VIEW.side.top = (LOCAL.height - VIEW.height) / 2;
    MODEL.viewScope.top = VIEW.side.top;
    MODEL.viewScope.left = VIEW.side.left;
    let canvas = document.getElementById("canvas");
    let left = VIEW.side.left + "px",
        top = VIEW.side.top + "px";
    canvas.style.margin = `${top} ${left}`;
};
 
 ```

#### Airplane

自主机的数据存储
```javascript 

let AIRPLANE = {
    self: null,         // 用于存放自主机的 sprite 的位置
    x: 0,
    y: 0,
    r: 0,               // 攻击方向
    size: 0,            // 自主机的大小
    pre: {x: 0, y:0},   // 上一帧的自主机坐标
    flag: true          // 是否是第一次读取数据
};

```

从 game model 里读取由 engine 创建的自主机的数据对象
```javascript 

let getAirplaneInfo = () => {
    ORIGIN.airplane = MODEL.data.engineControlData.airPlane;
    if (ORIGIN.airplane === null || ORIGIN.airplane === undefined) {
        return false;
    } else {
        return true;
    }
};

```

设置自主机的函数
```javascript 

let setAirplane = () => {
    // 从 game model 里读自主机的数据对象
    if (getAirplaneInfo()) {
        // 如果是第一次读取数据，则使前一帧和当前帧的坐标相同
        if (AIRPLANE.flag === true) {
            AIRPLANE.pre.x = ORIGIN.airplane.locationCurrent.x;
            AIRPLANE.pre.y = ORIGIN.airplane.locationCurrent.y;
            AIRPLANE.flag = false;
        } else {
            AIRPLANE.pre.x = AIRPLANE.x;
            AIRPLANE.pre.y = AIRPLANE.y;
        }
        AIRPLANE.x = ORIGIN.airplane.locationCurrent.x;
        AIRPLANE.y = ORIGIN.airplane.locationCurrent.y;
        AIRPLANE.r = ORIGIN.airplane.attackDir;

        // 如果自主机的 sprite 尚未被创建，则创建，并将读取到的数据赋予 sprite
        if (AIRPLANE.self === null || AIRPLANE.self === undefined) {
            let con = new Container();
            let skin = airplaneSkins[ORIGIN.airplane.skinId].skin,
                camp = airplaneSkins[ORIGIN.airplane.skinId].camp[0];
            con.addChild(createSprite(camp));
            for (let i = 0; i < skin.length; i ++) {
                con.addChild(createSprite(skin[i]));
            }
            setObjectSize(con, airplaneSkins[ORIGIN.airplane.skinId].skin_radius * 2);
            con.position.set(VIEW.center.x, VIEW.center.y);
            con.rotation = AIRPLANE.r;
            AIRPLANE.self = con;
            AirplaneLayer.addChild(AIRPLANE.self);
        }
        
        // 如果已经存在不可见的自主机 sprite ，设置其为可见
        if (AIRPLANE.self.visible === false) {
            AIRPLANE.self.visible = true;
        }
        AIRPLANE.self.rotation = AIRPLANE.r;

        // 如果 VIEW 场景改变，则重新设置自主机 sprite 的坐标和大小
        if (VIEW.flag === true) {
            setObjectSize(AIRPLANE.self, airplaneSkins[ORIGIN.airplane.skinId].skin_radius * 2);
            AIRPLANE.self.position.set(VIEW.center.x, VIEW.center.y);
        }

    // 如果 game model 里的自主机数据为空，判断是否为观战模式
    } else if (MODEL.gameMode === 0){

        // 若是观战模式，调整视野为最大，但是不创建自主机
        if (AIRPLANE.flag === true) {
            AIRPLANE.pre.x = VIRTUAL.width / 2;
            AIRPLANE.pre.y = VIRTUAL.height / 2;
            AIRPLANE.flag = false;
        } else {
            AIRPLANE.pre.x = AIRPLANE.x;
            AIRPLANE.pre.y = AIRPLANE.y;
        }
        AIRPLANE.x = VIRTUAL.width / 2;
        AIRPLANE.y = VIRTUAL.height / 2;
    } else if (MODEL.gameMode === 1) {

        // 若不是观战模式，则说明自主机还未被 engine 创建或其已经死亡，将存在的自主机 sprite 设置为不可见
        if (AIRPLANE.self !== null && AIRPLANE.self !== undefined) {
            AIRPLANE.self.visible = false;
            AIRPLANE.flag = true;
        }

    }
};

```

#### Select Balls

参数：
- type: 挑选的球的种类，是子弹还是飞机
- camp: 阵营，决定子弹或飞机的轮廓颜色
- skins: 对应的资源管理器皮肤
- layer: 挑选出来的球形成 sprite 后要加入的层次
- map: 对应的球的 sprite 数组，即资源池
- origin: game model 读取的数据，坐标、攻击方向等
- getInfo: 回调函数，获取数据

函数：
```javascript 

let selectBalls = (type, camp, skins, layer, map, origin, getInfo) => {
    // 获取数据
    if (getInfo()) {
        // 如果读取到数据
        // 创建计数对象
        let count = {};

        // 针对每一个球
        for (let i = 0; i < origin.length; i ++) {
            // 保存即时数据
            let skinId = origin[i].skinId,          // 皮肤种类
                radius = skins[skinId].skin_radius, // 皮肤半径
                x = origin[i].locationCurrent.x,
                y = origin[i].locationCurrent.y,
                r = origin[i].attackDir;

            // 根据每个球的可见皮肤的大小，设置可见范围
            let left = AIRPLANE.x - (CUT.width + radius) / 2,
                right = AIRPLANE.x + (CUT.width + radius) / 2,
                top = AIRPLANE.y - (CUT.height + radius) / 2,
                bottom = AIRPLANE.y + (CUT.height + radius) / 2;
            
            // 获取球的用户 id 和本身的 id
            let userId = origin[i].userId,
                id = origin[i].id;

            // 判断球是否在自主机的可见范围内
            if (x > left && x < right && y > top && y < bottom) {
                // 如果计数对象没有这种皮肤的数据，则添加
                if (count[skinId] === undefined) {
                    count[skinId] = 0;
                }
                // 记录一共有多少个该类皮肤的球
                count[skinId] += 1;
                
                // 如果没有该类皮肤的 sprite 数组，则添加
                if (map[skinId] === undefined) {
                    map[skinId] = [];
                }

                // 如果 sprite 数组没有多余的空闲 sprite， 创建新的 sprite
                if (count[skinId] > map[skinId].length) {
                    let ct = new Container();
                    let sk = skins[skinId].skin,
                        cp = skins[skinId].camp[camp];
                    switch (type) {
                        case TYPE.airplane :
                            ct.addChild(createSprite(cp));
                            for (let j = 0; j < sk.length; j ++) {
                                ct.addChild(createSprite(sk[j]));
                            }
                            break;

                        case TYPE.bullet :
                            for (let j = 0; j < sk.length; j ++) {
                                ct.addChild(createSprite(sk[j]));
                            }
                            ct.addChild(createSprite(cp));
                            break;

                        default: break;
                    }
                    updateBall(ct, x, y, r, radius);
                    layer.addChild(ct);
                    map[skinId].push(ct);

                // 如果有多余的空闲 sprite, 将其设置为可见，并更新数据
                } else {
                    let crtObj = map[skinId][count[skinId] - 1];
                    crtObj.visible = true;
                    updateBall(crtObj, x, y, r , radius * 2);
                }
            }
        }

        // 统计sprite 数组有多少种不同类型的球
        let map_keys = Object.keys(map);
        
        // 对于每种球，将多余的空闲 sprite 设置为不可见
        for (let n = 0; n < map_keys.length; n ++) {
            let begin = 0;
            if (count[map_keys[n]] !== undefined) {
                begin = count[map_keys[n]];
            }
            for (let m = begin; m < map[map_keys[n]].length; m ++) {
                map[map_keys[n]][m].visible = false;
            }
        }

    // 如果没有读取到球的数据，将所有的 sprite，都设置成不可见
    } else {
        let map_keys = Object.keys(map);
        for (let n = 0; n < map_keys.length; n ++) {
            for (let m = 0; m < map[map_keys[n]].length; m ++) {
                map[map_keys[n]][m].visible = false;
            }
        }
    }
};

```
