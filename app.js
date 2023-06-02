const http = require("http");
const fs = require("fs");
const index = fs.readFileSync("index.html");
const { ReadlineParser } = require("@serialport/parser-readline");
const { SerialPort } = require("serialport");
const socketIO = require("socket.io");

const port = new SerialPort({
  path: "COM5",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

const app = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

const io = socketIO.listen(app);

io.on("connection", function (socket) {
  console.log("Node is listening to port");
});

parser.on("data", function (data) {
  console.log("Received data from port: " + data);

  io.emit("data", data);
});

app.listen(3000);
