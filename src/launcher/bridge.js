/* bridge.js --- this file collects interfaces of all package need init.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

export const initSocket = (cb) => {console.log("socket inited.");cb(null, 1234);};
export const initView = () => console.log("view inited.");
export const socketDealGameInfo = () => console.log("socket deal game info.");
export const initEngine = (userId, name) => console.log(`engine inited with ${userId} and ${name}`);
export const socketConnect = (roomId, cb) => {
  setTimeout(() => {
    console.log("socket connected!");
    cb(null, true);
  }, 3000);
};

/* bridge.js ends here */
