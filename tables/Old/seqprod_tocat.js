var Sequelize = require('sequelize');
var ProdToCatModel = require('../models/ProdToCat');
const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});


const ProdToCat = ProdToCatModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
//console.log('Category table have been created');
});

module.exports = ProdToCat;
