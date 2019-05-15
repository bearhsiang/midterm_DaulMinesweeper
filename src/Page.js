import React from 'react';
import {Component} from 'react';
import './Page.css'
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import io from 'socket.io-client';
import Login from './Login'
class Page extends Component {
	constructor(props){
		super(props);
		this.endpoint = 'http://localhost:5555/';
		this.socket = io.connect(this.endpoint);
		this.state = {
			name: "",
			id: -1,
		};
		this.socket.on('validname', data => {
			this.setState(()=>({
				name: data.name,
				id: data.id,
			}))
		});
	}
	render(){
		return(
			<div className='page'>
				<Header title='DUAL MINE' name={this.state.name}/>
				{(this.state.name === "")? <Login socket={this.socket}/> : 
					<Main name={this.state.name} socket={this.socket} id={this.state.id}/>
				}
				<Footer />
			</div>
		)
	}
}
export default Page;