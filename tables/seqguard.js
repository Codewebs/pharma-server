var Sequelize = require('sequelize');
var GuardModel = require('../models/guard');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect:DBdialect,
  logging: false,
});


const Guard = GuardModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
 // console.log('Products db table have been created');
});

module.exports = Guard;