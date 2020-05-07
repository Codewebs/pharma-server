 

module.exports = (sequelize, type) => sequelize.define('oc_cart', {
    cart_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    api_id: type.INTEGER,
    customer_id : type.INTEGER,
    session_id : type.STRING,    
    product_id : type.INTEGER,
    recurring_id: type.INTEGER,    
    option : type.TEXT,
    quantity : type.INTEGER,
    date_added: type.DATE,
  }, {
  // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,

  // don't delete database entries but set the newly added attribute deletedAt
  // to the current date (when deletion was done). paranoid will only work if
  // timestamps are enabled
  paranoid: true,

  // don't use camelcase for automatically added attributes but underscore style
  // so updatedAt will be updated_at
  underscored: false,

  // disable the modification of tablenames; By default, sequelize will automatically
  // transform all passed model names (first parameter of define) into plural.
  // if you don't want that, set the following
  freezeTableName: true,

  // define the table's name
  tableName: 'oc_cart'
});
