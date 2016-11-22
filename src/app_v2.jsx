/*  app.js
*	author:yummyLcj
*	email:luchenjiemail@gmail.com
*/

import ReactDOM from "react-dom";
import React, { Component } from "react";

import ReactMarkdown from "react-markdown";

import BothEnd from "./component/bothEnd.jsx";
import ImageCard from "./component/image_card.jsx";
import Content from "./component/content.jsx";
import AppCss from "./app.css";

import ButtonMin from "./img/Button-min.png";
import MaybeAPicMin from "./img/MaybeAPic-min.png";
import GitHubMin from "./img/GitHub-min.png";

class App extends Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div style = {{width:"1000px",margin:"0 auto"}}>
				<BothEnd style={{margin:"30px auto 72px"}}>
					<span>BARRAGE</span>
					<span>Wiki</span>
					<span>test</span>
				</BothEnd>	

				<Content style={{width:"100%",height:"348px"}}>
					<div>
						<div>
							<p className={AppCss.title}>INTRODUCTION OF</p>
							<p className={AppCss.title}>THE AMAZING GAME</p>
						</div>
						<div style={{margin:"24px 0 36px"}}>
							<p className={AppCss.intro}>An online HTML5 game</p>
							<p className={AppCss.intro}>of multiplayer</p>
							<p className={AppCss.intro}>fight with dazzing bullets</p>
						</div>
						<div style={{height:"60px",display:"flex",alignItems:"center"}}>
							<img src={ButtonMin} style={{marginRight:"40px"}} />
							<a href="#" style={{textDecoration:"none"}}><span style={{height:"60px",verticalAlign:"center",color:"blue",fontSize:"18px"}}>or for more information</span></a>
						</div>					
					</div>
					<img src={MaybeAPicMin} alt="img"/>
				</Content>

	 			<BothEnd style={{margin:"125px auto 0",height:"45px"}}>
					<span>The NULL-HDU Team</span>
					<span>Visit us at github</span>
					<a href="#"><img src={GitHubMin} /></a>
				</BothEnd>
			</div>
		)

	}

}

ReactDOM.render(
	<App />,
	document.getElementById("app")
)
