/* gamemodel.js
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

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
    messageCache:[],
    deadCache:[],
    disappearCache:[],
    collisionCache:[],
    resourceRecord:{
        airPlaneTable:[],
        bulletTable:[],
        blockTable:[],
        foodTable:[],
        foodFuncTable:[],
        skillFuncTable:[],
        seatTable:[],
    },
    config: null,
}

/*gamemodel.js ends here*/
