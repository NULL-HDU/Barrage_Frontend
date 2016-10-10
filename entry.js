/* entry.js --- regist entry file for webpack
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

let join = require("path").join;
let entry_dir = join(__dirname, "./src");

module.exports = {
  //name: path
  //regist which file should be compile
  //test: [join(entry_dir, "./test/webpack_test.js")],
    handle_user_input: [join(entry_dir, "./engine/handle_user_input.js")],
}

/* entry.js ends here */
