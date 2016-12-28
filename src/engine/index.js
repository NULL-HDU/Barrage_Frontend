/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import gamemodel from "../model/gamemodel";
import {
    EVA01
} from "../resource/airplane/roleId.js";

import {
    startEngine,
    overEngine,
} from "./engine.js";
import {
    createAirplane
} from "../model/airplane.js";
import {
    changeKeyEventBindings,
    deleteKeyEventBindings
} from "./keybinding.js";

export const startGame = (userId, userName) => {
    changeKeyEventBindings();
    gamemodel.userId = userId;
    gamemodel.userName = userName;

    let airPlane = undefined;

    //check if it is admin or not
    if (userName === "admin") {
        gamemodel.gameMode = 0;
    } else {
        gamemodel.gameMode = 1;
        airPlane = createAirplane(EVA01);
    }
    gamemodel.data.engineControlData.airPlane = airPlane;

    startEngine();
};

export const overGame = () => {
    overEngine();
    deleteKeyEventBindings();
    gamemodel.config = null;
    gamemodel.userId = null;
    gamemodel.userName = null;
    gamemodel.gameMode = 0;
    gamemodel.data.engineControlData = {
        airPlane: undefined,
        bullet: [],
    };
    gamemodel.data.backendControlData = {
        airPlane: [],
        bullet: [],
        food: [],
    };
};

/*handle_user_input.js ends here*/
