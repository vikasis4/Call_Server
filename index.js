const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");


const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

app.use(cors());

const PORT = 8000;

app.get('/', (req, res) => {
	res.send('Running');
});


io.on("connection", (socket) => {

	socket.emit("yourID", socket.id);
	
	socket.on("remoteId", ({from, to}) => {
		io.to(to).emit("remoteId", from)
	});
	
	socket.on("iceCandidate", ({ to, candidate }) => {
		io.to(to).emit("remoteId", candidate)
	});
	
	socket.on("offer", ({ to, offer }) => {
		console.log('OffER');
		io.to(to).emit("offer", {from:socket.id, offer})
	});
	
	socket.on("answer", ({ to, answer }) => {
		console.log('AnswER', to);
		io.to(to).emit("answer", answer)
	});

	socket.on("close", ({ to }) => {
		io.to(to).emit("close", { close: 'now' })
	});

});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));