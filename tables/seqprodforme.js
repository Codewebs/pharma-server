var Sequelize = require('sequelize');
var ProdToFormeModel = require('../models/prodToForme');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect:DBdialect,
  logging: false,
});


const ProdToForme = ProdToFormeModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
 // console.log('Products db table have been created');
});

module.exports = ProdToForme;