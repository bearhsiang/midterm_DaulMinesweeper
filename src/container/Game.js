import React from 'react';
import {Component} from 'react';
import GameMap from '../component/GameMap'
import ReactCursorPosition from 'react-cursor-position';
class Game extends Component{
	render(){
		return(
			<div className='game'>
				<ReactCursorPosition className="example">
          			<GameMap socket={this.props.socket}/>
        		</ReactCursorPosition>
			</div>
		)
	}
}

export default Game;