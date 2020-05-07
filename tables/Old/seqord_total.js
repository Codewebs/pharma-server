var Sequelize = require('sequelize');

var OrderTotalModel = require('../models/order_total');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});

const OrderTotal = OrderTotalModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  //console.log('Category table have been created');
});

module.exports = OrderTotal;
