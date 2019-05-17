import React from 'react';
import {Component} from 'react';
import {Layer, Rect, Stage, Text} from 'react-konva';
// import Konva from 'konva';
class GameMap extends Component{
	constructor(props){
		super(props);
		this.socket = props.socket;
		this.canvas = React.createRef();
		this.state = {
			blockcolor: 'red',
			cvwidth: 500,
			cvheight: 500,
			w_num: 10,
			h_num: 10,
			// bgcolor: Konva.Util.getRandomColor(),
			bgcolor: 'orange',
			blocks: {},
			pad:1,
			gamestatus: 'Find a partner!',
			pairPosX: -100,
			pairPosY: -100,
			pairColor: 'blue',
			time: 0,
			host: 0,
			partner: "",
		}
		this.start_time = Date.now();
		// this.openBlock = this.openBlock.bind(this);
		this.blocks = {};
		this.intervalid = 0;
		// this.socket.emit('gamemapmount', {w_num:10, h_num:10, num:10});
		this.socket.on('initgamemap', data => {
			this.blocks = {};
			let map = data.map;
			for(let i = 0; i < this.state.w_num; i++){
				for(let j = 0; j < this.state.h_num; j++){
					let key = j*this.state.w_num+i;
					this.blocks[key] = {
						x: i,
						y: j,
						posx:1+this.state.cvwidth/this.state.w_num*i,
						posy:1+this.state.cvheight/this.state.h_num*j,
						status: 'close',
						value: 0,
					};
				}
			}
			map.forEach(key => {
				this.blocks[key].value = 'M';
				for(let i = -1; i <= 1; i++){
					for(let j = -1; j <= 1; j++){
						if(i === 0 && j === 0) continue;
						if(this.blocks[key].x+i < 0 || this.blocks[key].x+i >= this.state.w_num) continue;
						if(this.blocks[key].y+j < 0 || this.blocks[key].y+j >= this.state.h_num) continue;
						let t_key = (this.blocks[key].x+i)+this.state.w_num*(this.blocks[key].y+j);
						if(t_key in this.blocks){
							if(this.blocks[t_key].value !== 'M'){
								this.blocks[t_key].value += 1;
							}
						}
					}
				}
			});
			this.setState(()=> ({
				blocks: this.blocks,
				gamestatus: 'going',
				pairPosX: -100,
				pairPosY: -100,
				time: 0,
				host: data.host,
				partner: data.partner,
			}));
			this.start_time = Date.now();
			this.intervalid = setInterval(this.updateTime, 100);
		});
		this.socket.on('pairPos', data => {
			this.setState(()=>({
				pairPosX: data['x'],
				pairPosY: data['y'],
			}))
			// console.log(data);
		});
		this.socket.on('pairClick', data => {
			this.handleClick(data);
		})
	}
	updateTime = () => {
		this.setState(() => ({
			time: (Date.now()-this.start_time)/1000,
		}));
	}
	openBlock =(id) => {
		// console.log(id);
		if(this.blocks[id].status === 'open') return;
		this.blocks[id].status = 'open';
		if(this.blocks[id].value !== 0) return;
		for(let i = -1; i <= 1; i++){
			for(let j = -1; j <= 1; j++){
				let new_x = this.blocks[id].x + i;
				let new_y = this.blocks[id].y + j;
				if(new_x < 0 || new_x >= this.state.w_num || new_y < 0 || new_y >= this.state.h_num) continue;
				let new_id = new_x+new_y*this.state.w_num;
				if(new_id in this.state.blocks){
					this.openBlock(new_id);
				}
			}
		}
		return;
	}
	// handleLose = () => {
	// 	console.log('you loss');
	// 	this.setState(()=>({gamestatus: 'Loss QQ'}));
	// 	this.socket.emit('gameresult', {result: 'loss', time: 10});
	// 	clearInterval(this.intervalid);
	// };
	checkWin = () => {
		for(let key in this.blocks){
			if(this.blocks[key].value !== 'M'){
				if(this.blocks[key].status === 'close') return false;
			}
		}
		return true;
	};
	handleFinish = (result) => {
		// console.log(result);
		if(result === 'win'){
			this.setState(()=>({gamestatus: 'Win !!!'}));
		}else{
			this.setState(()=>({gamestatus: 'Loss QQ'}));
		}
		if(this.state.host === 1){
			this.socket.emit('gameresult', {result: result, time: this.state.time});
		}
		clearInterval(this.intervalid);
	}
	// handleWin = () => {
	// 	console.log('you win!');
	// 	this.setState(()=>({gamestatus: 'Win !!!'}));
	// 	this.socket.emit('gameresult', {result: 'win', time: 20});
	// 	clearInterval(this.intervalid);
	// }
	handleClick = (e) => {
		if(this.state.gamestatus !== 'going') return;

		let lose = 0;
		if(this.blocks[e].value === 'M'){
			this.blocks[e].status = 'open';
			// this.handleLose();
			this.handleFinish('lose');
			lose = 1;
		}else{
			this.openBlock(e);
		}
		this.setState(()=>({
			blocks: this.blocks,
		}));
		if(lose === 0 && this.checkWin()){
			// this.handleWin();
			this.handleFinish('win');
		}
	}
	preHandleClick = (e) => {
		this.socket.emit('pairClick', e.target.index);
		this.handleClick(e.target.index);
	}
	mouseMove = () => {
		this.socket.emit('mousePos', this.props.position);
		// console.log(this.props.position);
	}
	render(){
		// console.log(this.state.pairPosX);
		// console.log(this.state.pairPosY);
		let block_draw = [];
		let ans_draw = [];
		for(let key in this.state.blocks){
			block_draw.push(
				<Rect 
					key={key}
					width={this.state.cvwidth/this.state.w_num-2}
					height={this.state.cvheight/this.state.h_num-2}
					fill={this.state.blocks[key].status === 'open' ? '':this.state.blockcolor}
					x={this.state.blocks[key].posx}
					y={this.state.blocks[key].posy}
					onclick={this.preHandleClick}
				/>
			);
			if(this.state.blocks[key].value === 0) continue;
			ans_draw.push(
				<Text 
					key={key}
					fontSize={12}
					x={this.state.blocks[key].posx}
					y={this.state.blocks[key].posy}
					width={this.state.cvwidth/this.state.w_num>>0}
					height={this.state.cvheight/this.state.h_num>>0}
					align='center'
					verticalAlign='middle'
					text={this.state.blocks[key].value.toString()}
				/>
			);
			// console.log('push'+this.state.blocks[key].value);
		}
		return(
			<div onMouseMove={(this.state.gamestatus === 'going')? this.mouseMove:null} 
				className='gamemap'>
				<Stage width={this.state.cvwidth} height={this.state.cvwidth}>
					<Layer className="bg">
						<Rect 
							width={this.state.cvwidth}
							height={this.state.cvheight}
							fill={this.state.bgcolor}
							opacity={0.5}
						/>
					</Layer>
					<Layer className='ans'>
						{ans_draw}
					</Layer>
					<Layer>
						{block_draw}
					</Layer>
					<Layer>
						<Rect 
							width={10} height={10}
							fill={this.state.pairColor}
							x={this.state.pairPosX}
							y={this.state.pairPosY}
						/>
						{this.state.gamestatus !== 'going' ? 
						<Text 
							x={0}
							y={0}
							fontSize={50}
							fontStyle='bold'
							fill='yellow'
							width={this.state.cvwidth}
							height={this.state.cvheight}
							align='center'
							verticalAlign='middle'
							text={this.state.gamestatus} /> : null}
					</Layer>
				</Stage>
				<h1 className="timer">{this.state.gamestatus === 'Find a partner!' ? '':`play with ${this.state.partner}  `}{this.state.time.toFixed(1)}</h1>
			</div>
		)
	};
		// detectedEnvironment: {
		// 		isMouseDetected = false,
		// 		isTouchDetected = false
		// 	  } = {},
		// 	  elementDimensions: {
		// 		width = 0,
		// 		height = 0
		// 	  } = {},
		// 	  isActive = false,
		// 	  isPositionOutside = false,
		// 	  position: {
		// 		x = 0,
		// 		y = 0
		// 	  } = {}
		// 	} = props;
}

export default GameMap;