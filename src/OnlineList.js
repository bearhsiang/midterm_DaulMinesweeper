import React from 'react';
import {Component} from 'react';

class OnlineList extends Component{
	constructor(props){
		super(props);
		this.id = props.id.toString();
		this.name = props.name;
		this.socket = props.socket;
		this.state = {
			playerlist: {},
			gaminglist: [],
		};
		this.socket.on('updatelist', list => {
			this.setState(() => ({playerlist: list}));
			// console.log(list);
		});
		this.socket.on('message', data => {
			// console.log(`server sent ${data}`);
		})
		this.socket.on('onlinestatus', data => {
			let t = [];
			for(let id in data){
				t.push(id.toString());
				t.push(data[id].toString());
			}
			this.setState(()=>({
				gaminglist: t
			}));
			// console.log(`gamming ${this.state.gaminglist}`);
		});
	}
	handleInvite = (e) => {
		e.persist();
		// console.log(e.target.id);
		// console.log(this.id);
		// console.log(e);
		if(e.target.id === this.id) return;
		this.socket.emit('invite', e.target.id);
	}
	render(){
		let playerlist = [];
		// console.log(this.state.playerlist);
		for(let key in this.state.playerlist){
			if(key === this.id) continue;
			let classname = 'onlinelist_item'+ (this.state.gaminglist.includes(key) ? ' busy':'');
			playerlist.push(<li className={classname} key={key}>
				{/* {this.state.playerlist[key] === this.name ? null:
				<button className='onlinelist_button' onClick={this.handleInvite} value={key}> Invite </button>} */}
				<div className="onlinelist_name" onClick={this.handleInvite} id={key}>{this.state.playerlist[key] }</div>
				</li>);
		}
		return(
			// <div className='onlinelist'>
				<ul className='onlinelist'>
					{playerlist}
				</ul>
			// </div>
		)
	};
}

export default OnlineList;