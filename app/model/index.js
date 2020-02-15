const { Sequelize, DataTypes } = require('sequelize');
const usersModel = require('./users');
const config = require('../config/db');

const sequelize = new Sequelize({ ...config, dialect: 'postgres' });

const db = {
  sequelize,
  users: usersModel(sequelize, DataTypes),
};

module.exports = db;
