var app = require('express')();
var http = require('http').Server(app);
const mongoose = require('mongoose');
const Result = require('./models/result');
var serverSocket = require('socket.io')(http);

var port = 5555;
var name2sid = {};
var id2name = {};
var name2id = {};
var sid2name = {};
var player_num = 0;
var gamepairsid = {};
var gamepairid = {};
var createMap = (x, y, num) => {
	let mine = [];
	while(mine.length<num){
		let t = Math.floor(Math.random()*x*y);
		if(!(mine.includes(t))){
			mine.push(t)
		}
	}
	return mine;
};
mongoose.connect('mongodb+srv://hsiang:test@cluster0-q7gvp.gcp.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
})
db = mongoose.connection
db.on('error', error => {
    console.log(error)
})
db.once('open', () => {
    console.log('MongoDB connected!')
	serverSocket.on('connection', socket => {
		console.log('get connection');

		socket.on('ScoreBoardmount', data => {
			Result.find()
			// .limit(3)
			.sort({time: 1})
			.exec((err, res) => {
				if (err) throw err
				socket.emit('initSocreBoard', res);
				// console.log(res);
			})
		})
		
		socket.on('send', data => {
			let name = data.name;
			let msg = data.msg;
			let receiver = data.receiver;
			// console.log(socket.id);
			// console.log(data);
			if(receiver in name2sid){
				// console.log(`sent to ${name} ${msg}`);
				serverSocket.to(name2sid[receiver]).emit('add', msg);
			}

		});
		socket.on('setName', name => {
			name2sid[name] = socket.id;
			// console.log(name2sid);
		})
		socket.on('canvasmount', () => {
			// console.log('canvasmount');
			// console.log(socket.id);
		});
		////// new
		socket.on('listmount', data => {
			socket.emit('updatelist', id2name);
		});
		socket.on('login', name => {
			// console.log(name);
			if(name in name2sid){
				socket.emit('invalidname', `"${name}" has been used.`);
				return;
			}
			socket.emit('validname', {name: name, id: player_num});
			name2sid[name] = socket.id;
			sid2name[socket.id] = name;
			id2name[player_num] = name;
			name2id[name] = player_num;
			player_num ++;
			serverSocket.emit('updatelist', id2name);
			socket.emit('onlinestatus', gamepairid);
			// console.log(playerlist);
		});
		socket.on('disconnect', data => {
			name = sid2name[socket.id];
			id = name2id[name];
			delete sid2name[socket.id];
			delete name2sid[name];
			delete name2id[name];
			delete id2name[id];
			serverSocket.emit('updatelist', id2name);
		});
		socket.on('gamemapmount', data => {
			socket.emit('initgamemap', [5, 7, 64]);
		});
		socket.on('gameresult', data => {
			let name1 = sid2name[socket.id];
			let name2 = sid2name[gamepairsid[socket.id]];
			let result = data.result;
			let time = data.time;
			const r = new Result({name1, name2, result, time});
			r.save(err => {
				if (err) console.error(err)
				// serverSocket.emit('addResult', r);
				Result.find()
				.sort({time: 1})
				.exec((err, res) => {
					if (err) throw err
					serverSocket.emit('initSocreBoard', res);
				})
				// console.log(res);
			})
			delete gamepairid[name2id[sid2name[socket.id]]]
			delete gamepairsid[gamepairsid[socket.id]]
			delete gamepairsid[socket.id]
			serverSocket.emit('onlinestatus', gamepairid);
		});
		socket.on('invite', id => {
			// console.log(gamepairsid);
			if(socket.id in gamepairsid){
				socket.emit('message', 'you are in game!');
				return;
			}
			if(name2sid[id2name[id]] in gamepairsid){
				socket.emit('message', `${id2name[id]} is in game!`);
				return;
			}
			gamepairid[name2id[sid2name[socket.id]]] = id;
			gamepairsid[socket.id] = name2sid[id2name[id]];
			gamepairsid[name2sid[id2name[id]]] = socket.id;
			let map = createMap(10, 10, 10);
			socket.emit('initgamemap', {map: map, host: 1, partner:id2name[id]});
			serverSocket.to(name2sid[id2name[id]]).emit('initgamemap', {map: map, host: 0, partner: sid2name[socket.id]});
			serverSocket.emit('onlinestatus', gamepairid);
		});
		socket.on('mousePos', data => {
			serverSocket.to(gamepairsid[socket.id]).emit('pairPos', data);
			// console.log(data);
			// if(socket.id in name2sid){
			// 	serverSocket.to(name2sid[data.des]).emit('game_loc', data.data);
			// }
		});
		socket.on('pairClick', data => {
			serverSocket.to(gamepairsid[socket.id]).emit('pairClick', data);
		});
	});
});
app.get('/', (req, res) => {
	res.send("<h1>welcome</h1>");
});

http.listen(port, () => {
	console.log('server listen '+port);
});
