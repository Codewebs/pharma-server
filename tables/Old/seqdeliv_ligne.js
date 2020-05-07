var Sequelize = require('sequelize');

var DeliveryModel = require('../models/delivery_ligne');

const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});

const Delivery = DeliveryModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('Category table have been created');
});

module.exports = Delivery;
