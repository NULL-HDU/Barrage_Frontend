/* bridge.js --- this file collects interfaces of all package need init.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import {startGame} from "../engine_init.js";
import transmitted from "../socket/transmitted.js";

let _initSocket = (cb) => {console.log("socket inited.");cb(null, 1234);};
// TODO: Add view init interface.
let _initView = () => console.log("view inited.");
let _socketDealGameInfo = () => console.log("socket Deal game info");
let _initEngine = (userId, name) => {
  console.log(`engine inited with ${userId} and ${name}`);
  startGame(userId,name);
};
let _socketConnect = (roomId, cb) => {
    setTimeout(() => {
          console.log("socket connected!");
          cb(null, true);
        }, 3000);
};

// It won't connect to backend while you are developing by default,
// if you want to connect to backend, run following command in the session of shell
// where you run webpack-server:
//
//    export NODE_ENV="testing"
//
// then start your webpack-server.
if(__ENV__.NODE_ENV === "testing" || __ENV__.NODE_ENV === "production"){
  let tm = new transmitted();

  _initSocket = tm.initSocket;
  // TODO: Add view init interface.
  _initView = () => console.log("view inited.");
  _socketDealGameInfo = tm.playgroundInfo;
  _initEngine = (userId, name) => {
    console.log(`engine inited with ${userId} and ${name}`);
    startGame(userId,name);
  };
  _socketConnect = tm.connect;
}

export const initSocket = _initSocket;
export const initView = _initView;
export const socketDealGameInfo = _socketDealGameInfo;
export const initEngine = _initEngine;
export const socketConnect = _socketConnect;

/* bridge.js ends here */
