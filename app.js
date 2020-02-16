const express = require('express');
const http = require('http');
const pg = require('pg');

// QUERIES
const getUsersQuery = () => 'SELECT * FROM users';

const getCitiesQuery = cityNames => {
  const cityNamesJoined = cityNames
    .map(city => `name = '${city}'`)
    .join(' OR ');
  return `SELECT * from cities WHERE ${cityNamesJoined}`;
};

const getUserQuery = (id) => {
  if (typeof id !== "undefined") {
    return `SELECT * FROM users WHERE id = ${id}`;
  } else {
    return 'SELECT * FROM users ORDER BY ID DESC LIMIT 1';
  };
} 

const createUserQuery = (newUser) => 
`INSERT INTO users (firstname, lastname, email, address, city) 
VALUES ('${newUser.firstname}', '${newUser.lastname}', '${newUser.email}', '${newUser.address}', '${newUser.city}')`;

const updateUserQuery = (change, id) => 
`UPDATE users 
SET firstname = '${change.firstname}', lastname = '${change.lastname}',email = '${change.email}', address = '${change.address}', city = '${change.city}' 
WHERE id = ${id};`;

const deleteUserQuery = (id) => `DELETE FROM users WHERE id = ${id};`; 

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
    const usersResult = await client.query(getUsersQuery());
    const users = usersResult.rows;

    if (req.query['city-details'] === 'true') {
      const cityNames = usersResult.rows.map(user => user.city);
      const cityNamesUnique = Array.from(new Set(cityNames));
      const cityResult = await client.query(getCitiesQuery(cityNamesUnique));
      const cityObjects = cityResult.rows;

      const data = users.map(user => {
        const defaultCity = { name: user.city };
        const cityFromTable = cityObjects.find(city => city.name === user.city);
        return { ...user, city: cityFromTable || defaultCity };
      });

      res.status(200).send({ data });
    } else {
      res.status(200).send({ data: users });
    }
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
app
  .set('port', port)
  .use(express.static('.'))
  .use(express.json())
  .use('/api/users', router);

// SERVER
http
  .createServer(app)
  .listen(port, () => console.log(`App listening on port ${port}!`));
