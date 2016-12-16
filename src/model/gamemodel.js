/* gamemodel.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */
export default {
    background: null,
    data: {
        engineControlData:{
            airPlane: undefined,
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
        airPlaneTable:{},
        bulletTable:{},
        blockTable:{},
        foodTable:{},
        skinTable:{},
        foodFuncTable:{},
        seatTable:{},
    },
    config: null,
};

/*gamemodel.js ends here*/
