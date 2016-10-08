/* webpack_test.js --- test file for webpack environment.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import Knowlege from "../img/knowlege.png";

window.onload = () => {
  let a = "just a test";
  console.log(a);
  let b = "another test";
  console.log(b);

  let img = document.createElement("img");
  img.src = Knowlege;
  document.body.appendChild(img);
};

/* webpack_test.js ends here */
