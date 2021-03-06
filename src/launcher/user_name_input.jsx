/* user_name_input.jsx --- user name input page
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";

import TextField from "./components/TextField.jsx";
import {changeHash} from "../utils/url.js";
import Data from "./launcher_data.js";
import {
    socketConnect,
    initSocket,
} from "./bridge.js";

export default class UsernameInputPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      errorValue: "",
      infoValue: "Press enter and let's fighting",
      loading: false
    };

    this.re = /^[a-z]\w{2,}$/i;

    this.handleEnter = this.handleEnter.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(v){
    if(v.length >= 3 && !this.re.test(v)){
      this.setState({
        errorValue: "Please tell me your correct name, warrior"
      });
      return;
    }

    // hide error info, show loading
    this.setState({
      errorValue: "",
    });
  }

  handleEnter(v){
    if(!this.re.test(v)){
      this.setState({
        errorValue: "Please tell me your correct name, warrior"
      });
      return;
    }

    // hide error info, show loading
    this.setState({
      errorValue: "",
      loading: true
    });

    Data.Name = v;
    initSocket((err, userId) => {
        if(err !== null){
            changeHash(`error?error=${err.toString()}`);
            return;
        }
        Data.UserId = userId;

        socketConnect(Data.RoomId, (err) => {
            // change hash
            if(err !== null){
                changeHash(`error?error=${err.toString()}`);
                return;
            }

            window.location.hash = "/game";
        });
    });
  }

  render() {

    let centreElement = (
      <TextField
          style={{
            width: 270,
            margin: "250px auto"
          }}
          prompt={this.state.errorValue ? "Hey~" : "Hi!"}
          hint="Name"
          infoValue={this.state.infoValue}
          errorValue={this.state.errorValue}
          onEnter={this.handleEnter}
          onChange={this.handleChange}
      />);

    if(this.state.loading){
      centreElement = (
        <p style={{
          width: 200,
          color: "white",
          margin: "280px auto",
          fontSize: "3em"
        }}>Loading...</p>
      );
    }

    return (
      <div style={{margin: "0 0", padding: "0 0", width: "100%", height:"100%"}}>
        {centreElement}
      </div>
    );
  }
}
UsernameInputPage.propTypes = {
  style: React.PropTypes.object
};
UsernameInputPage.defaultProps = {
  style: {}
};


/* user_name_input.jsx ends here */
