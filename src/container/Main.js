import React from 'react';
import {Component} from 'react';
import ScoreBoard from '../component/ScoreBoard'
import Game from './Game'
import OnlineList from '../component/OnlineList'
class Main extends Component{
	render(){
		return(
			<div className='container' socket={this.props.socket}>
					<ScoreBoard socket={this.props.socket} name={this.props.name}/>
					<Game socket={this.props.socket} name={this.props.name}/>
					<OnlineList socket={this.props.socket} name={this.props.name} id={this.props.id}/>
			</div>
		)
	}
}

export default Main;