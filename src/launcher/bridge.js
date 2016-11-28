/* bridge.js --- this file collects interfaces of all package need init.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import {startGame} from "../engine_init.js"
import transmitted from "../socket/transmitted.js"

let tm = new transmitted();

export const initSocket = tm.initSocket;
export const initView = () => console.log("view inited.");
export const socketDealGameInfo = tm.playgroundInfo;
export const initEngine = (userId, name) => {
	console.log(`engine inited with ${userId} and ${name}`);
	startGame(userId,name);
};
export const socketConnect = tm.connect;

/* bridge.js ends here */
