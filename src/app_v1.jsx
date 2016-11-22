/* app.js --- the entry of this web application
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

import ReactDOM from "react-dom";
import React, { Component } from "react";

import ReactMarkdown from "react-markdown";

import GoldenFrame from "./component/golden_frame.jsx";
import ImageCard from "./component/image_card.jsx";
import data from "./data.js";

import Space from "./img/Space.png";
import Play from "./img/Play.png";
import MovingShip from "./img/MovingShip.png";
import littleBack from "./img/littleBack.png";
import Barrage from "./img/Barrage.png";

class App extends Component {

  constructor(props){
    super(props);
  }

  render() {

    let boardSize = {
        width: 980,
        height: 605,
    };

    let bodyMargin = (window.screen.availHeight - boardSize.height) / 2;

    return (

      <GoldenFrame flow="row" style={{
        width: boardSize.width,
        height: boardSize.height,
        margin: bodyMargin + "px auto",
        lineHeight: "1.4em",
        alignItems: "flex-start"
      }}>

        <GoldenFrame reverse={true}>
            <ImageCard style={{
              width: 595,
              height: 159
            }} background={Barrage}/>

          <div style={{
            color: "white",
            padding: "4px 16px"
          }}>

            <ReactMarkdown source={data.src} style={{width: "100%", height: "100%"}}/>

          </div>

        </GoldenFrame>

        <GoldenFrame>

          <div>
            <ImageCard style={{
              width: 365,
              height: 365
            }} background={Space}/>
          </div>

          <div>
            <ImageCard style={{
              width: 365,
              height: 75
            }} background={littleBack} image={MovingShip} />

            <ImageCard style={{
              width: 365,
              height: 135
            }} background={Play} onClick={() => window.location="http://182.254.146.148:8888"}/>

          </div>
        </GoldenFrame>

      </GoldenFrame>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById("app")
);


/* app.js ends here */
