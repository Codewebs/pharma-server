var Sequelize = require('sequelize');
var CityModel = require('../models/city');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect:DBdialect,
  logging: false,
});


const City = CityModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
 // console.log('Products db table have been created');
});

module.exports = City;
