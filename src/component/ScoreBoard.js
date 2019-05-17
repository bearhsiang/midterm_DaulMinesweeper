import React from 'react';
import {Component} from 'react';

class ScoreBoard extends Component{
	constructor(props){
		super(props);
		this.name = props.name;
		this.socket = props.socket;
		this.state = {
			resultlist: [],
		};
		this.resultlist = [];
		this.socket.on('initSocreBoard', data => {
			this.resultlist = data;
			this.renew();
		});
		this.socket.emit('ScoreBoardmount');
		this.socket.on('addResult', data => {
			this.resultlist.push(data);
			this.renew();
		});
	}
	renew = () => {
		this.setState(()=>({
			resultlist: this.resultlist,
		}))
	};
	render(){
		// console.log("score");
		// console.log(this.state.resultlist);
		let count = 1;
		return(
			// <div className='onlinelist'>
				<ol className='scoreboard'>
					{this.state.resultlist.map(data => (
						<li key={data._id} className={"scoreboard_item"+((data.result === 'lose' )? ' lose':'')}>
							{count ++}. {data.name1}{" with "}{data.name2}
							<br />
							{data.result}{"  "}{data.time+'s'}
						</li>
					))}
				</ol>
			// </div>
		)
	};
}

export default ScoreBoard;