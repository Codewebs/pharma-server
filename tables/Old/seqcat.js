var Sequelize = require('sequelize');

var CategoryModel = require('../models/category');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});

const Category = CategoryModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  //console.log('Category table have been created');
});

module.exports = Category;
