/* handle_user_input.js --- use to handle user input,like input nickname,shoot,move and so on.
 * 
 * Maintainer: Arthury (ArthurYV)
 * Email: arthury.me@gmail.com
 */

var playerNameInput = document.getElementById('playerNameInput');

var debug = function(args) {
    if (console && console.log) {
        console.log(args);
    }
};

var validNick() {
    var regex = /^\w*$/;
    debug('Regex Test', regex.exec(playerNameInput.value));
    regex regex.exec(playerNameInput.value) !== null;
};

window.onload = function() {
    var
}


/*handle_user_input.js ends here*/
