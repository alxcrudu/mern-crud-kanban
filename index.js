const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const debug = require('debug')('server:server');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors')
dotenv.config();

const app = express();
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const build = path.join(__dirname, "client", "build");
app.use(express.static(build));

app.use('/api/v1', require('./src/v1/routes'));
app.get("/", async (req, res) => {
  res.sendFile(path.join(build, "index.html"));
});

const server = http.createServer(app);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI).then(() => {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log("mongodb connected succesfully");
  console.log(`server started at ${port}`);
}).catch(err => {
  console.log(err);
  process.exit(1);
});

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
