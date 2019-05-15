import React from 'react';
import { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import ReactCursorPosition from 'react-cursor-position';
import {Layer, Rect, Stage, Group} from 'react-konva';
import Konva from 'konva';
var text = ["first"];

// socket.on('add',data => {
//   text.push(data);
//   console.log('get add');
//   console.log(text);
// });

// const socket = io.connect("http://localhost:5555/");

// socket.on('add', data => {
//   console.log('get add');
//   text.push(data);

// });

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      endpoint: "http://localhost:5555/",
      show: text,
      name: "default",
      mouseX: 0,
      mouseY: 0,
    };
    this.namebox = React.createRef();
    this.receiver = React.createRef();
    this.msg = React.createRef();
    this.socket = io.connect(this.state.endpoint);
  }
  
  sendto = () => {
    this.socket.emit('send', {
      name: this.state.name,
      receiver: this.receiver.current.value,
      msg: this.msg.current.value,
    });
    this.msg.current.value = "";
    this.receiver.current.value = "";
  }

  Show = () => {
    console.log("show");
    this.setState(() => ({
      show: text,
    }));
  }
  changeName = () => {
    console.log("changeName");
    this.setState(()=> ({
      name: this.namebox.current.value,
    }), 
    () => {
      this.namebox.current.value = "";
      this.socket.emit("setName", this.state.name);
    });
    
  }
  componentDidMount = () => {
    // setInterval(this.Show, 1000);
    // this.checkAdd();
    this.socket.on('add', data => {
      console.log('get add');
      text.push(data);
      this.Show();
    });
  };

  mouseMove = (e) => {
    e.persist();
    this.setState(() => ({
      mouseX: e.screenX,
      mouseY: e.screenY,
    }))
    console.log("mouse move");
  };
  render(){
    return (
      <div>
        <h2>{this.state.name}</h2>
        <input ref={this.namebox} type='text' placeholder='Name' />
        <button onClick={this.changeName}>Change Name</button>
        <br></br>
        <input ref={this.msg} type='text' placeholder='text' />
        <input ref={this.receiver} type='text' placeholder='to Who' />
        <button onClick={this.sendto}>sendto</button>
        <ul>
        {text.map(ele => (
          <li>{ele}</li>
        ))}
        </ul>
        {/* <div className="canvas" onMouseMove = {this.mouseMove}>
          canvas
        </div> */}
        {/* <h2>{this.state.mouseX}</h2>
        <h2>{this.state.mouseY}</h2> */}
        <ReactCursorPosition className="example">
          <Canvas socket={this.socket}/>
        </ReactCursorPosition>
      </div>
    )
  }
}

class Canvas extends Component {
  constructor(props){
    super(props);
    this.socket = props.socket;
    this.canvas = React.createRef();
    this.state = {
      bgcolor: Konva.Util.getRandomColor(),
      x_num: 10,
      y_num: 10,
      game_loc: {x:0, y:0},
    }
    this.blocks = [];
    for(let i = 0; i < this.state.x_num; i++){
      for(let j = 0; j < this.state.y_num; j++){
        this.blocks.push({x:i, y:j, key:i*this.state.x_num+j});
      }
    }
    
  };

  componentDidMount = () => {
    this.socket.emit('canvasmount');
    console.log(this.blocks);
    this.socket.on('game_loc', data => {
      // console.log("get game loc");
      this.setState(()=>({
        game_loc: data,
      }
      ))
    });
  };
  mouseMove = () => {
    this.socket.emit('mousePos', {des:'test', data:this.props.position});
    // console.log(this.props);
  };
  handleClick = () => {
    this.setState(() => ({
      bgcolor: Konva.Util.getRandomColor(),
    }));
  };
  render(){
    return(
      <div onMouseMove={this.mouseMove}>
        <div className='playerCanvas'>
        <Stage width={500} height={500}>
          <Layer>
            {/* {this.blocks.map(ele => (
              <Rect
                key={ele.key}
                width={5} height={5}
                fill={this.state.bgcolor}
                x={1+ele.x*7} y={1+ele.y*7}
                />
            //   <Rect 
            //     key={ele.key}
            //     width={50} height={50}
            //     fill={this.state.bgcolor}
            //     onClick={this.handleClick}
            //     x={ele.x*51} y={ele.y*51}
            // />
            ))} */}
            <Rect 
            width={10} height={10}
            fill={this.state.bgcolor}
            onClick={this.handleClick}
            x={this.props.position.x}
            y={this.props.position.y}
            />
          </Layer>
        </Stage>
        </div>
        <div className='playerCanvas'>
        <Stage width={500} height={500}>
          <Layer>
            <Rect 
            width={10} height={10}
            fill={this.state.bgcolor}
            onClick={this.handleClick}
            x={this.state.game_loc.x}
            y={this.state.game_loc.y}
            />
          </Layer>
        </Stage>
        </div>
        <h1>{this.props.position.x}</h1>
        <h1>{this.props.position.y}</h1>
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

export default App;
