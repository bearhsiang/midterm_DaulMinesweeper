import React from 'react';
import {Component} from 'react';

class Login extends Component{
	constructor(props){
		super(props);
		this.state = {
			msg: 'Name',
		};
		this.socket = props.socket;
		this.socket.on('invalidname', msg => {
			this.setState(()=>({
				msg: msg,
			}));
		});
		this.input = React.createRef();
	}
	handleSubmit = (e) => {
		e.preventDefault();
		// console.log(this.input.current.value);
		this.props.socket.emit('login', this.input.current.value);
		this.input.current.value = "";
		
	}
	render(){
		return(
			<div className='loginPage'>
				<form onSubmit={this.handleSubmit}>
					<h1>
						Come and play with us!
					</h1>
					<input className='loginInput'
					ref={this.input}
					type='text'
					autoFocus={true}
					placeholder={this.state.msg}/>
					{/* // onChange={this.opInput}/> */}
				</form>
			</div>
		)
	}
}

export default Login;