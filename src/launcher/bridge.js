/* bridge.js --- this file collects interfaces of all package need init.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import {
    startGame,
    overGame
} from "../engine/index.js";
import * as tm from "../socket/transmitted.js";
import iGameModel from "../model/gamemodel_init.js";
import {
    initView as iview,
    overView as oview
} from "../view/Nview.js";

let _initGameModel = iGameModel;
let _initSocket = (cb) => {
    console.log("socket inited.");
    cb(null, 1234);
};
let _overSocket = () => {
    tm.overSocket();
    console.log("socket over.");
};
let _initView = (cb) => {
    iview(cb);
    console.log("view init.");
};
let _overView = () => {
    oview();
    console.log("view over.");
};
let _initEngine = (userId, name) => {
    console.log(`engine inited with ${userId} and ${name}`);
    startGame(userId, name);
};
let _overEngine = () => {
    overGame();
    console.log("engine over.");
};
let _socketConnect = (roomId, cb) => {
    setTimeout(() => {
        console.log("socket connected!");
        cb(null, true);
    }, 1500);
};

// It won't connect to backend while you are developing by default,
// if you want to connect to backend, run following command in the session of shell
// where you run webpack-server:
//
//   export NODE_ENV="testing"
//
// then start your webpack-server.
if (__ENV__ === "testing" || __ENV__ === "production") {
    _initSocket = tm.initSocket;
    _socketConnect = tm.connect;
}

export const initSocket = _initSocket;
export const initView = _initView;
export const initEngine = _initEngine;
export const socketConnect = _socketConnect;
export const initGameModel = _initGameModel;

export const overEngine = _overEngine;
export const overSocket = _overSocket;
export const overView = _overView;

/* bridge.js ends here */
