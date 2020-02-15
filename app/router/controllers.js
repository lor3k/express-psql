const db = require('../model/index');

const getUsers = async (req, res) => {
  try {
    const data = await db.users.findAll();
    res.status(200).send({ data });
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (req, res) => {
  try {
    const data = await db.users.findOne();
    res.status(200).send({ data });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getUsers, getUser };

// export const getUser = async (req, res) => {
//   try {
//     const result = await client.query(getUserQuery(req.params.id));
//     res.status(200).send({ data: result.rows[0] });
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const createUser = async (req, res, next) => {
//   try {
//     await client.query(createUserQuery(req.body));
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const updateUser = async (req, res, next) => {
//   try {
//     await client.query(updateUserQuery(req.body, req.params.id));
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const deleteUser = async (req, res, next) => {
//   try {
//     await client.query(deleteUserQuery(req.params.id));
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// };
