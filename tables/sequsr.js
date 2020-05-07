 var Sequelize = require('sequelize');
var UserModel = require('../models/user');


const sequelize = new Sequelize(DBase, DBuser, DBpass, {
  host: DBhost,
  dialect: DBdialect,
  logging: false,
});



const User = UserModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
 // console.log('Users db and user table have been created');
});

module.exports = User;