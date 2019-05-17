import React from 'react';
import {Component} from 'react';
class Header extends Component {
	render(){
		return(
			<div className="header">
				<h1>{this.props.title}</h1>
				<p> - play for fun! {this.props.name}</p>
			</div>
		)
	}
}

export default Header;