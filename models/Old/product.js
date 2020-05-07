 

module.exports = (sequelize, type) => sequelize.define('oc_product', {
    product_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: type.STRING,
    name: type.STRING,
    tax_class_id : type.INTEGER,
    location : type.STRING,    
    prod_image : type.STRING,
    sort_order: type.STRING,    
    shipping  : type.STRING,
    date_added : type.DATE,
    date_modified: type.DATE,
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
  tableName: 'oc_product'
});
