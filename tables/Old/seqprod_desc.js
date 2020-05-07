 var Sequelize = require('sequelize');
var ProdDescModel = require('../models/product_description');
const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect:DBdialect,
  logging: false,
});


const ProdDesc = ProdDescModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  //console.log('product_description db table have been created');
});

module.exports = ProdDesc;
