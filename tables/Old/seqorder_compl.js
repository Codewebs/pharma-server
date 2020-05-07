var Sequelize = require('sequelize');

var OrderComplModel = require('../models/order_complement');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});

const OrderCompl = OrderComplModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  //console.log('Category table have been created');
});

module.exports = OrderCompl;
