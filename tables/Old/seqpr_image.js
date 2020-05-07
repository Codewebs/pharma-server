 var Sequelize = require('sequelize');
var PrimModel = require('../models/product_image');
const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});



const Primage = PrimModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
//console.log('Category table have been created');
});

module.exports = Primage;
