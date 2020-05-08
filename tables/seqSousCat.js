var Sequelize = require('sequelize');
var SousCategoryModel = require('../models/sousCategory');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect:DBdialect,
  logging: false,
});


const SousCategory = SousCategoryModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
 // console.log('Products db table have been created');
});

module.exports = SousCategory;
