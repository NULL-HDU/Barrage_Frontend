

//mouse event
export const mouse=()=>{
    let mouse = {};
    mouse.move = undefined;
    mouse.up = undefined;
    mouse.down = undefined;
    mouse.over = undefined;

    mouse.upHandler = (event)=> {
        event.preventDefault();
    };
};

//shift like event detect
export const shiftLikeEvent=(desc)=> {
    let key = {};
    key.desc = desc;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    if(key.desc === "shift"){
        key.downHandler = (event)=> {
            if(event.shiftKey){
                //console.log("down detect");
                if(key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };

        key.upHandler = (event)=> {
            if(!event.shiftKey){
                //console.log("up detect");
                if(key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };
    }

    window.addEventListener("keydown",key.downHandler.bind(key),false);
    window.addEventListener("keyup",key.upHandler.bind(key),false);

    return key;

};

//keyboard
export const keyboard=(keyCode)=> {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = (event)=> {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = (event)=> {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;

        event.preventDefault();
        }
    };

    //Attach event listeners
    window.addEventListener( "keydown", key.downHandler.bind(key), false);
    window.addEventListener( "keyup", key.upHandler.bind(key), false);

    return key;
};
