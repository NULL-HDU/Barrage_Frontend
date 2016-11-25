/* error.jsx --- this file provide a component to show error.
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";

export default class ShowErrorPage extends Component {

  constructor(props){
    super(props);
  }

  handleClick(){
    window.location.hash = "/";
    window.location.reload();
  }

  render() {
    return (
      <div style={{margin: "0 0", padding: "0 0", width: "100%", height:"100%"}}>
        <p style={{
          color: "#EA4335",
          width: 600,
          textAlign: "center",
          margin: "280px auto",
          fontSize: "30px"
        }}>
          {this.props.location.search.split("=")[1]}
        </p>
        <div style={{width: 700, margin: "0 auto",  textAlign:"end" }} >
          <hr style={{color: "white"}}/>
          <a href="#javascript(0);"
             style={{color: "white",fontSize: "20px"}}
             onClick={this.handleClick}>restart</a>
        </div>
      </div>
    );
  }
}
ShowErrorPage.propTypes = {
  style: React.PropTypes.object
};
ShowErrorPage.defaultProps = {
  style: {}
};

/* error.jsx ends here */
