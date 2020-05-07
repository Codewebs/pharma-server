var Sequelize = require('sequelize');
var ProdToCatModel = require('../models/prodTocat');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect:DBdialect,
  logging: false,
});

const ProdToCat = ProdToCatModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
 // console.log('Products db table have been created');
});
module.exports = ProdToCat;
