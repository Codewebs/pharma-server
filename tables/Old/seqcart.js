 var Sequelize = require('sequelize');

var Sequelize = require('sequelize');

var CartModel = require('../models/cart');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});

const Cart = CartModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  //console.log('Category table have been created');
});

module.exports = Cart;
