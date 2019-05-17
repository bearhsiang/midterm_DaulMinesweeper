Dual Minesweeper
===
an online application for two players to play minesweeper game together.


## How to use?

* Clone the repository
* use `npm install` to install nesesary packages
* use `npm start` to run web application
* use `npm run db` to run backend server

## Interface
* Login page
![](https://i.imgur.com/shjmAEE.png)

* Main page
![](https://i.imgur.com/vIgkshy.png)

## Project description

the project includes two parts:
* React based font-end web application
* Node based back-end server (include database)

#### Web application
* use React framework to build dynamic page
* use `react-cursor-position` to get the cursor position refers to certain component
* use `socket.io` to communicate with back-end server
* use `react-konva`, `konva` to draw the game map

#### Back-end server
* use `express`, `http`, `socket.io`to construct the connection channel between web application
* use `mongodb`, `mongoose` to maintain online database
#### My contribution
* Outline design, all the implementation excluding the packages mensioned above.

## Reflection
* Node has lots of useful packages available and make the implimentation more convenient.
* Some built-in object (e.g. ref) are also useful, we sould get more familiar with them.
* Outline design is diffacult too!!!