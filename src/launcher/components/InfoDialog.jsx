import React, { Component  } from "react";

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

export default class InfoDialog extends Component {
  
  constructor(props) {
    super(props);
    this.state = {"open": false};

    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);

    this.title = "info";
    this.info = "info";
  }

  // @params title      String
  // @params info       String
  // @params clickFunc  Function(Boolean)  the function called after user click a button
  //                                       if user click "ok", Boolean is true, otherwise false.
  Open(title, info, clickFunc) {
    this.title = title;
    this.info = info;
    this.clickFunc = clickFunc;
    this.handleDialogOpen();
  }

  State(){
    return this.state.open;
  }

  Close(){
    this.handleDialogClose();
  }

  handleDialogOpen() {
    this.setState({"open": true});
  }

  handleDialogClose() {
    this.setState({"open": false});
  }

  handleCancel() {
    if(this.clickFunc) this.clickFunc(false);

    this.clickFunc = null;
    this.handleDialogClose();
  }

  handleOk() {
    if(this.clickFunc) this.clickFunc(true);

    this.clickFunc = null;
    this.handleDialogClose();
  }

  render() {
    let actions = [
      <FlatButton label="Cancel" primary={true} keyboardFocused={true} onTouchTap={this.handleCancel} />,
      <FlatButton label="Ok" primary={true} keyboardFocused={true} onTouchTap={this.handleOk} />
    ];

    if(this.props.anotherButton){
      actions.push(this.props.anotherButton);
    }

    return (
      <Dialog 
        {...this.props}
        title={this.title}
        actions={actions}
        modal={true}
        open={this.state.open}
      >
        {this.info}
      </Dialog>
    );
  }
}
InfoDialog.propTypes = {
  anotherButton: React.PropTypes.element
};
InfoDialog.defaultProps = {
};
