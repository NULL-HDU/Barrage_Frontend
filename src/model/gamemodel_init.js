/* gamemodel_init.js --- init game model.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */
import gamemodel from "./gamemodel.js";
import bulletTable from "../resource/bullet/bullet_role.js";
import airPlaneTable from "../resource/airplane/airplane_role.js";
import {
  airplaneSkins,
  bulletSkins
} from "../resource/skin/skin.js";

export default () => {
  gamemodel.resourceRecord.skinTable = {};
  gamemodel.resourceRecord.skinTable.airplane = airplaneSkins;
  gamemodel.resourceRecord.skinTable.bullet = bulletSkins;

  gamemodel.resourceRecord.airPlaneTable = airPlaneTable;
  gamemodel.resourceRecord.bulletTable = bulletTable;
};



/* gamemodel_init.js ends here */
