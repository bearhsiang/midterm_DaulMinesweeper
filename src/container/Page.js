import React from 'react';
import {Component} from 'react';
import '../styles/Page.css'
import Header from '../component/Header';
import Main from './Main';
import Footer from '../component/Footer';
import io from 'socket.io-client';
import Login from '../component/Login'

const END_POINT = 'http://localhost:5555'
class Page extends Component {
	constructor(props){
		super(props);
		this.endpoint = END_POINT;
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