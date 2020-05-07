var Sequelize = require('sequelize');
var ProdToSubCatModel = require('../models/prodToSubCat');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect:DBdialect,
  logging: false,
});

const ProdToSubCat = ProdToSubCatModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
 // console.log('Products db table have been created');
});

module.exports = ProdToSubCat;
