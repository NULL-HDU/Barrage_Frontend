/* utils.js --- some utils for skill functions.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import gamemodel from "../../model/gamemodel";
import global from "../../global.js";

export let skillFramework = (bulletsInterval, skill) => {
    let data = gamemodel.data.engineControlData;
    let countMax = bulletsInterval / global.GAME_LOOP_INTERVAL;
    let count = countMax;

    return (airPlane, angle) => {
        // if count is less than coutMax, don't call skill function.
        if (--count > 0) return true;
        count = countMax;

        return skill(data, airPlane, angle);
    };
};

/* utils.js ends here */
