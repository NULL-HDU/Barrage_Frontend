/* gamemodel.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */
export default {
    viewScope: {
      width: 0,
      height: 0,
      top: 0,
      left: 0
    },
    background: null,
    userName: null,
    gameMode: 0, //0 visitMode,1 fightMode
    userId: null,
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
