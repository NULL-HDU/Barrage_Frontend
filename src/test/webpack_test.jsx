/* webpack_test.js --- test file for webpack environment.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";
import ReactDOM from "react-dom";

class TestComponent extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <img src="/static/img/knowlege.png" />
    );
  }
}
TestComponent.propTypes = {
  style: React.PropTypes.object
};
TestComponent.defaultProps = {
  style: {}
};

ReactDOM.render(
  <TestComponent />,
  document.getElementById("app")
);

/* webpack_test.js ends here */
