var Sequelize = require('sequelize');

var ProdComplModel = require('../models/prod_complement');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});

const ProdCompl = ProdComplModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  //console.log('Category table have been created');
});

module.exports = ProdCompl;
