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
const getUserQuery = () => ''; // TO DO
const createUserQuery = ({ lastname, firstname, address, city, email }) => ({
  text: 'INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, $5, NOW(), NOW());',
  values: [lastname, firstname, address, city, email],
});
const updateUserQuery = () => ''; // TO DO
const deleteUserQuery = index => `DELETE FROM users WHERE id='${index}'`;

// APP PORT
const port = process.env.PORT || 3000;
const localDatabase = 'postgres://pawel:pawel@localhost:5432/pawel';
const dataBaseUrl = process.env.DATABASE_URL || localDatabase;

// POSTGRES CLIENT
const client = new pg.Client(dataBaseUrl);

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
  .post('/', createUser, getUsers)
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
