/* TextField.jsx --- a component to receive user input
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import React, { Component } from "react";

let defaultStyle = {
  textAlign: "left",
  color: "white"
};
let promptStyle = {
  fontSize: "36px",
  fontWeight: "medium",
  lineHeight: "38px",
  margin: "0 0 0 5px"
};
let inputStyle = {
  width: "100%",
  height: 38,
  backgroundColor: "#052338",
  color: "white",
  textDecoration: "none",
  fontWeight: "regular",
  fontSize: "24px",
  lineHeight: "38px",
  border: "solid 1px #dcdcdc",
  boxSizing: "border-box",
  padding: "0 0 0 5px",
  margin: "0 0",
  outline: "none"

};
let inputFocusStyle = {
    border: "solid 1px #CCCCCC"
};
let infoStyle = {
  fontSize: "10px",
  fontWeight: "regular",
  lineHeight: "23px",
  margin: "0 0 0 5px"
};
let errorStyle = {
  color: "#EA4335",
  fontSize: "10px",
  fontWeight: "regular",
  lineHeight: "23px",
  margin: "0 0 0 5px"
};

export default class PromptInfoTextField extends Component {
  // prompt
  // ------------------------
  // | hint                 |
  // ------------------------
  // info
  //
  // This component is the user input element with promt and info and some special style.
  // @props style      Object           specify Component style.
  // @props errorValue String           show error information, it will use error style for info.
  // @props infoValue  String           show normal information.
  // @props prompt     String           specify value of prompt.
  // @props hint       String           specify value of hint
  // @props maxlength  String           specify the max length of intput
  // @props onChange   Function(String) this function will be called when value of input is changed.
  // @props onEnter    Function()       this function will be called when user finish their input and press enter.

  constructor(props){
    super(props);
    this.state = {
      inputFocus: false,
      value: ""
    };

    this.inputStyle = inputStyle;

    this.handleInputOnFocus = this.handleInputOnFocus.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputEnter = this.handleInputEnter.bind(this);
  }

  handleInputChange(e){
    this.setState({
      value: e.target.value
    });

    if(this.props.onChange){
      this.props.onChange(e.target.value);
    }
  }

  handleInputOnFocus(){
    this.inputStyle = Object.assign({}, inputStyle, inputFocusStyle);
    this.setState({
      inputFocus: true
    });
  }

  handleInputOnBlur(){
    this.inputStyle = inputStyle;
    this.setState({
      inputFocus: false
    });
  }

  handleInputEnter(e){
    if(e.charCode === 13 && this.props.onEnter){
      this.props.onEnter(this.state.value);
    }
  }

  render() {

    let iStyle = this.props.errorValue ?  errorStyle :infoStyle;
    let iValue = this.props.errorValue ? this.props.errorValue : this.props.infoValue;

    return (
      <div style={Object.assign({}, defaultStyle, this.props.style)}>
        <p style={promptStyle}>
          {this.props.prompt}
        </p>
        <input type="text" tabIndex="0"
               autoFocus
               value={this.state.value}
               placeholder={this.props.hint}
               maxLength={this.props.maxlength}
               style={this.inputStyle}
               onFocus={this.handleInputOnFocus}
               onBlur={this.handleInputOnBlur}
               onChange={this.handleInputChange}
               onKeyPress={this.handleInputEnter}
        />
        <p style={iStyle}>{iValue}</p>
      </div>
    );
  }
}
PromptInfoTextField.propTypes = {
  style: React.PropTypes.object,
  errorValue: React.PropTypes.string,
  infoValue: React.PropTypes.string,
  prompt: React.PropTypes.string,
  hint: React.PropTypes.string,
  maxlength: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onEnter: React.PropTypes.func
};
PromptInfoTextField.defaultProps = {
  style: {},
  infoValue: "place input something.",
  prompt: "Prompt",
  hint: "hint",
  maxlength: "25",
};


/* TextField.jsx ends here */
