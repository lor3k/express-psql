const express = require('express');
const http = require('http');
const pg = require('pg');

// QUERIES
const getUsersQuery = () => 'SELECT * FROM users';

const getUserQuery = () => ''; // TO DO

const createUserQuery = (newUser) => `INSERT INTO users (firstname, lastname, email, address, city) VALUES (${newUser.firstname}, ${newUser.lastname}, ${newUser.email}, ${newUser.adress}, ${newUser.city})`; // TO DO

const updateUserQuery = () => 'UPDATE users SET some_column = some_value WHERE some_column = some_value;'; // TO DO

const deleteUserQuery = () => ''; // TO DO

// APP PORT
const port = 3000;

// DATABASE CONFIG
const data = {
  user: 'postgres', // CHANGE
  database: 'bazaKrzysia', // CHANGE
  password: 'postgres', // CHANGE
  port: 5432,
  host: 'localhost',
};

// POSTGRES CLIENT
const client = new pg.Client(data);

client
  .connect()
  .then(() => console.log('Connected to database'))
  .catch(e => console.log(e));

// ROUTER
const router = express.Router();

// ROUTER HANDLERS
const getUsers = async (req, res) => {
  try {
    const result = await client.query(getUsersQuery());
    res.status(200).send({ data: result.rows });
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (req, res) => {
  try {
    const result = await client.query(getUserQuery(req.params.id));
    res.status(200).send({ data: result.rows[0] });
  } catch (err) {
    console.log(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    await client.query(createUserQuery(req.body));
    next();
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    await client.query(updateUserQuery(req.body, req.params.id));
    next();
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await client.query(deleteUserQuery(req.params.id));
    next();
  } catch (err) {
    console.log(err);
  }
};

// ROUTER ROUTES
router
  .get('/', getUsers)
  .get('/:id', getUser)
  .post('/', createUser, getUser)
  .put('/:id', updateUser, getUser)
  .delete('/:id', deleteUser, getUsers);

// APP SETTINGS
const app = express();
app.set('port', port).use('/users', router);

// SERVER
http
  .createServer(app)
  .listen(port, () => console.log(`App listening on port ${port}!`));
