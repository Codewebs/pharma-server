 

module.exports = (sequelize, type) => sequelize.define('oc_delivery', {
    delivery_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: type.INTEGER,
    customer_id : type.INTEGER,
    driver_id : type.INTEGER,    
    comment:type.TEXT,
    phone_number:type.STRING,
    date_added: type.DATE,
    seen:type.STRING,
    channel:type.STRING,
    latitude:type.STRING,
    longitude:type.STRING,
    roadname:type.STRING,
    
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
  tableName: 'oc_delivery'
});
