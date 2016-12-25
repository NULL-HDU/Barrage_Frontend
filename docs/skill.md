# Skill

## Introduction

各个 skill 的作用都是产生 bullet ，但一个 skill 中的 bullet 不是在 skill 函数的一次调用中就全部产生完毕的，skill 也是有作用时间的。每次引擎运行都会调用一遍处于激活状态的 skill。

每个 skill 都有cd时间，每次调用 skill 函数前都会检查 skill 的cd是否完成，只有cd结束了才会真正地调用 skill。

当绑定 skill 的按键被按下时，会使用特定的 skillType 启动 skillEngine，而当松开该按键时，skillEngine 会被关闭。

## Implement

### Skill Engine

skillEngine 主要为了解决一个问题：玩家在按住一个 skill 按键时，想使用另一个 skill，但是有时候玩家的手指并不是非常灵活，在按另一个 skill 按键时未松开当前的 skill 按键，这样就导致两个技能在同时使用。

以及另一个延伸出来的问题：玩家若不间断地敲击 skill 按键，可能会开启多个 skillEngine ，造成资源浪费。

skillEngine 的代码全部写在 `src/engine/skill.js` 中，它由 4 部分组成，状态对象，checkToCallSkillFuncThenLoop, enableSkillEngine 与 disableSkillEngine：

```javascript
let skillFlags = {
    engineOn: 0,                //  0 表示开启状态， 1 表示关闭状态
    currentSkillType: null,     //  当前 skill 按键的 skillType
};

let checkToCallSkillFuncThenLoop = (skillType) => {
    // 定时检查 engineOn 与 currentSkillType，如果 engineOn == 0 && currentSkillType == skillType，则使用技能
    // 否则结束该函数
    ...
};

// 开启 skillEngine
export const enableSkillEngine = (skillType) => {
    skillFlags.engineOn = 0;

    if (skillFlags.currentSkillType === skillType) return;
    skillFlags.currentSkillType = skillType;
    checkToCallSkillFuncThenLoop(skillType);
};

// 关闭 skillEngine
export const disableSkillEngine = (skillType) => {
    if (skillType === skillFlags.currentSkillType) {
        skillFlags.engineOn = 1;
    }
};
```

在为 skill 做 keybind 时，应该在 press 时调用 enableSkillEngine(skillType)，release 时调用 disableSkillEngine(skillType)。

*skillType 是在 `airplane.skills` 中的键，常量值定义在 `src/constant.js` 中*

### Use Skill

airplane 对象中有以下属性是用于 skill 的实现的：

```javascript
{
    skills: {
        Number: {                       // 以 skillType 值为键
            skillCD: Number,            // skill 的cd时间 单位：ms
            skillname: String,
            skillFunc: Function,        // 该函数返回一个用于创建 bullet 的函数 
        },
        ...
    },
    CDCount: {Number: Number, ...},     // cd计数器，以 skillType 值为键，count 为值的对象
    CD: {Number: Number, ...},          // cd时间，以 skillType 值为键，单位：GLI
    
    activeSkillList: Array<Function>,   // 储存skillFunc调用后返回的函数
}
```

*其中 GLI 是`GAME_LOOP_INTERVAL`，表示两次引擎运转的间隔时间，该常量在`src/global.js`中定义*

skills 对象来自于 `src/resource/airplane/airplane_role.js` (GamemodelInit() 会被赋值到 `gamemodel.resourceRecord.airPlaneTable`)，airplane 创建时构造函数通过roleId在 `gamemodel.resourceRecord.airPlaneTable` 查询到，并将其合并到 airplane 对象。

CDCount 与 CD 都是构造函数创建的，其中CD的值通过 skillCD 换算得到。

主要通过 airplane 的以下 3 个方法实现 use skill：

```javascript
skillCountDown() {
    // 每次引擎运行时都会调用，
    // 对 CDCount 中的每个键值对的值都减 1
    ...
}

skillActive() {
    // 每次引擎运行时都会调用，
    // skillActive 调用所有 activeSkillList 中的函数，那些函数会产生 bullet 并且一定会返回一个 boolean 值，表示 
    // 相应函数是否已经完毕（skill 作用时间结束）。
    // 如果返回的是 false 表示，skill 作用时间已结束，相应函数会被从 activeSkillList 中删除。

    this.activeSkillList = this.activeSkillList.filter(f => f(this, this.attackDir + Math.PI * 3 / 2));
}

useSkill(skillType) {
    // useSkill 会先检查CDCount[skillType]是否小于等于 0，如果是，则调用相应
    // skillType 的 skillFunc 并将结果 push 到 activeSkillList，重新设置
    // CDCount[skillType] 为 CD[skillType]。 否则结束函数。
    //
    // skillEngine 中使用特定技能的 skillType 调用该方法
    ...
}
```

### skill function

skillFunc 的函数签名为：`() -> (Airplane, Number) -> Boolean`

skillFunc 返回的函数的第一个参数是使用技能的 airplane 对象，第二额参数是 airplane 的攻击方向（角度）。

当skillFunc被调用后返回的函数会被加入到 airplane.activeSkillList 中，并且每次引擎运行都会被调用，所以在该函数内部需要有个计数器来记录调用次数，并每次都检验该计数器，但到达一定数值时产生子弹，以实现子弹间断性发生的效果。

在 `src/resource/skill/utils.js` 已经提供了一个 skillFramework 函数对以上的逻辑进行封装。

skillFramework 的函数签名为：`skillFramework :: (Object, Airplane, Number) -> Boolean a => (Number,  a) -> Boolean`

该函数的第一个参数为产生子弹的时间间隔（调用第二个参数的时间间隔，单位为 ms），第二个参数是一个用于产生子弹的函数。其中，a的第一个参数是 `gamemodel.data.engineControlData` ，第二个参数为使用技能的 airplane 对象，第三个参数是 airplane 的攻击方向（角度）。

*之所以，需要传一个角度参数是因为 `airplane.attackDir` 并不是真正的攻击角度，需要换算后才能够实用*

所以一个 skillFunc 的大概写法是：

```javascript
let skillFunc = () => {
    // do some init
    ...

    return skillFramework(TWO_BULLET_INTERVAL, (data, airPlane, angle) => {
        // generate bullets
        ...
        return True ;// or False
    });
};
```

当然，如果你想写的是一个技能，那么你还需要写一些额外的信息，并把该文件放在 `src/resource/skill/` 文件夹下面：

```javascript
export default {
    skillName: String,          // 技能名
    skillFunc: Function,        // skillFunc
    skillCD:   Number,          // cd 时间，单位 ms
};
```


