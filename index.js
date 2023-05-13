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
	console.log(socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("exchangeID", ({ from, to }) => {
		io.to(to).emit("exchangeID", { from });
	});

	socket.on("callUser", ({ userToCall, signalData }) => {
		io.to(userToCall).emit("callUser", { signal: signalData });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));