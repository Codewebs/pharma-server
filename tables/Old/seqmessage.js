 var Sequelize = require('sequelize');

var Sequelize = require('sequelize');

var MessagesModel = require('../models/message');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});

const Message = MessagesModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  //console.log('Category table have been created');
});

module.exports = Message;
