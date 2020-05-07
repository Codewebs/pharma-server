 var Sequelize = require('sequelize');
var CatDescModel = require('../models/category_description');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});


const CatDesc = CatDescModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
 // console.log('Cate_description db table have been created');
});

module.exports = CatDesc;