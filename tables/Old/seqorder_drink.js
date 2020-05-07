var Sequelize = require('sequelize');

var OrderDrinkModel = require('../models/order_drink');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});

const Order_Drink = OrderDrinkModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  //console.log('Category table have been created');
});

module.exports = Order_Drink;
