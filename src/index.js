import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Page from './Page'

// import ReactCursorPosition from 'react-cursor-position';

ReactDOM.render(<Page />, document.getElementById('root'));

// class Example extends React.Component {
// 	render() {
// 	  return (
// 		<ReactCursorPosition className="example">
// 		  <PositionLabel />
// 		</ReactCursorPosition>
// 	  );
// 	}
//   }
  
//   const PositionLabel = (props) => {
// 	const {
// 	  detectedEnvironment: {
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
  
// 	return (
// 	  <div className="example__label">
// 		{`x: ${x}`}<br />
// 		{`y: ${y}`}<br />
// 		{`width:: ${width}`}<br />
// 		{`height: ${height}`}<br />
// 		{`isActive: ${isActive}`}<br />
// 		{`isPositionOutside: ${isPositionOutside ? 'true' : 'false'}`}<br />
// 		{`isMouseDetected: ${isMouseDetected ? 'true' : 'false'}`}<br />
// 			  {`isTouchDetected: ${isTouchDetected ? 'true' : 'false'}`}
// 	  </div>
// 	);
//  };
  
// ReactDOM.render(
// 	<Example />,
// 	document.getElementById('root')
// );
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
