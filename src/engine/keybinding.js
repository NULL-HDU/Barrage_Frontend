import global from "../global";
import {
    KEY
} from "../constant.js";
import screenfull from "./screenfull.js";
import gamemodel from "../model/gamemodel";
import {
    disableSkillEngine,
    enableSkillEngine
} from "./skill.js";
import {
    LEFT_SKILL,
    RIGHT_SKILL,
    Q_SKILL,
    E_DEFEND_SKILL
} from "../constant.js";

let test = -1;

let windowEventTuples = [];

//keyboard
let keyboard = (keyCode) => {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = (event) => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = (event) => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;

            event.preventDefault();
        }
    };

    let keydownTuple = ["keydown", key.downHandler.bind(key), false];
    let keyupTuple = ["keyup", key.upHandler.bind(key), false];

    //Attach event listeners
    window.addEventListener(...keydownTuple);
    window.addEventListener(...keyupTuple);

    windowEventTuples.push(keydownTuple);
    windowEventTuples.push(keyupTuple);

    return key;
};

let configCanvasEventListen = () => {
    let data = gamemodel.data.engineControlData;

    let mouseMove = (e) => {
        if (data.airPlane === undefined) return;
        let vs = gamemodel.viewScope;

        let oppositeSide = (e.pageX - vs.width / 2);
        let limb = (e.pageY - vs.height / 2);
        let A = Math.atan2(limb, oppositeSide) + Math.PI / 2;
        data.airPlane.attackDir = A;
    };


    let mouseRelease = (e) => {
        if (e.which === 3) {
            // console.log("right click");
            disableSkillEngine(RIGHT_SKILL);
        } else if (e.which === 1) {
            //        console.log("left click");
            disableSkillEngine(LEFT_SKILL);
        }
    };

    let mousePress = (e) => {

        if (e.which === 3) {
            // console.log("right click");
            enableSkillEngine(RIGHT_SKILL);
        } else if (e.which === 1) {
            // console.log("left click");
            enableSkillEngine(LEFT_SKILL);
        }
    };

    //屏蔽右键菜单
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    }, false);

    let canvas = document.getElementById("canvas");
    let mousedownTuple = ["mousedown", mousePress];
    let mouseupTuple = ["mouseup", mouseRelease];
    let mousemoveTuple = ["mousemove", mouseMove];
    canvas.addEventListener(...mousemoveTuple);
    canvas.addEventListener(...mouseupTuple);
    canvas.addEventListener(...mousedownTuple);
};

let configKeyEventListen = () => {
    let data = gamemodel.data.engineControlData;
    let left = keyboard(KEY.A),
        up = keyboard(KEY.W),
        right = keyboard(KEY.D),
        down = keyboard(KEY.S),
        defend_skill = keyboard(KEY.E),
        skill1 = keyboard(KEY.Q),
        shift = keyboard(KEY.SHIFT),
        space = keyboard(KEY.SPACE),
        f11 = keyboard(KEY.F11);

    let ifApIsValid = (f) => () => {
        if (data.airPlane !== undefined) return f(data.airPlane);
    };

    shift.press = ifApIsValid((ap) => {
        if (test == 1)
            console.log("shift press");
        ap.slowRate = global.AIRPLANE_SLOW_RATE;
    });

    shift.release = ifApIsValid((ap) => {
        if (test == 1)
            console.log("shift release");
        ap.slowRate = 1;
    });

    space.press = ifApIsValid((ap) => {
        if (test == 1)
            console.log('space press');
        enableSkillEngine(LEFT_SKILL);
    });

    space.release = ifApIsValid((ap) => {

        if (test == 1)
            console.log('space release');
        disableSkillEngine(LEFT_SKILL);
    });

    f11.press = ifApIsValid((ap) => {
        if (test == 1)
            console.log("f11 press");
    });

    f11.release = ifApIsValid((ap) => {
        if (test == 1)
            console.log("f11 release");
        if (screenfull.enabled) {
            screenfull.request();
        }
    });

    up.press = ifApIsValid((ap) => {
        if (test == 1)
            console.log('up press');
        ap.vd.y = -1;
    });

    up.release = ifApIsValid((ap) => {
        if (test == 1)
            console.log('up release');
        if (down.isUp) {
            ap.vd.y = 0;
        } else {
            down.press();
        }
    });

    down.press = ifApIsValid((ap) => {
        if (test == 1)
            console.log('down press');
        ap.vd.y = 1;
    });

    down.release = ifApIsValid((ap) => {
        if (test == 1)
            console.log('down release');
        if (up.isUp) {
            ap.vd.y = 0;
        } else {
            up.press();
        }
    });


    left.press = ifApIsValid((ap) => {
        if (test == 1)
            console.log('left press');
        ap.vd.x = -1;
    });


    left.release = ifApIsValid((ap) => {
        if (test == 1)
            console.log('left release');
        if (right.isUp) {
            ap.vd.x = 0;
        } else {
            right.press();
        }
    });

    right.press = ifApIsValid((ap) => {
        if (test == 1)
            console.log('right press');
        ap.vd.x = 1;
    });

    right.release = ifApIsValid((ap) => {

        if (test == 1)
            console.log('right release');
        if (left.isUp) {
            ap.vd.x = 0;
        } else {
            left.press();
        }
    });

    skill1.press = ifApIsValid((ap) => {
        enableSkillEngine(Q_SKILL);
    });

    skill1.release = ifApIsValid((ap) => {
        disableSkillEngine(Q_SKILL);
    });

    defend_skill.press = ifApIsValid((ap) => {
        enableSkillEngine(E_DEFEND_SKILL);
    });

    defend_skill.release = ifApIsValid((ap) => {
        disableSkillEngine(E_DEFEND_SKILL);
    });
};

export const changeKeyEventBindings = () => {
    configKeyEventListen();
    configCanvasEventListen();
};

export const deleteKeyEventBindings = () => {
    for (let tuple of windowEventTuples) {
        window.removeEventListener(...tuple);
    }
};
