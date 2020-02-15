const express = require('express');
const http = require('http');
const { getUsers, getUser } = require('./router/controllers');
const db = require('./model/index');

const port = 3000;

db.sequelize
  .authenticate()
  .then(() => console.log('Connected to database'))
  .catch(e => console.log(e));

// ROUTER
const router = express
  .Router()
  .get('/', getUsers)
  .get('/:id', getUser);
// .post('/', createUser, getUser)
// .put('/:id', updateUser, getUser)
// .delete('/:id', deleteUser, getUsers);

// APP
const app = express();
app
  .set('port', port)
  .use(express.static('.'))
  .use(express.json())
  .use('/api/users', router);

// SERVER
http
  .createServer(app)
  .listen(port, () => console.log(`App listening on port ${port}!`));
