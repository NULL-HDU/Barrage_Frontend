/* init.jsx --- init socket and user name input page.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";
import ReactDOM from "react-dom";
import TextField from "./launcher/components/TextField.jsx";
import {
  Router,
  Route,
  IndexRoute,
  Link,
  hashHistory
} from "react-router";

class ShowString extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <p>{this.props.string}</p>
        {this.props.children}
      </div>
    );
  }
}
ShowString.propTypes = {
  style: React.PropTypes.object,
  string: React.PropTypes.string
};
ShowString.defaultProps = {
  style: {},
  string: "hello world"
};


window.onload = () => {
  ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/"  component={() => (<TextField/>)} />
      <Route path="/send" component={() => (<Link to={"#/send"} >sendall</Link>)} />
    </Router>,
    document.getElementById("app"));
};


/* init.jsx ends here */
