/* gamemodel.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

import bulletRole from "../bullet_role.js"

export default {
    background: null,
    data: {
        engineControlData:{
            airPlane:null,
            bullet:[],
        },
        backendControlData:{
            airPlane:[],
            bullet:[],
            food:[],
        },
    },
    socketCache:{
        damageInformation:[],
        newBallInformation:[],
        disapperBulletInformation:[],
    },
    deadCache:[],
    disappearCache:[],
    collisionCache:[],
    resourceRecord:{
        airPlaneTable:[],
        bulletTable:bulletRole,
        blockTable:[],
        foodTable:[],
        foodFuncTable:[],
        skillFuncTable:[],
        seatTable:[],
    },
    config: null,
};

/*gamemodel.js ends here*/
