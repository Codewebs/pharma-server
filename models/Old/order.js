 

module.exports = (sequelize, type) => sequelize.define('oc_order', {
    order_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_no: type.INTEGER,
    invoice_prefix : type.STRING,
    store_id : type.INTEGER,    
    store_name : type.STRING,
    store_url: type.STRING,    
    customer_id : type.INTEGER,
    customer_group_id : type.INTEGER,
    firstname : type.STRING,
    lastname : type.STRING,
    email : type.STRING,
    telephone : type.STRING,
    fax : type.STRING,
    custom_field : type.TEXT,
    payment_firstname : type.STRING,
    payment_lastname : type.STRING,
    payment_company : type.STRING,
    payment_address_1 : type.STRING,
    payment_address_2 : type.STRING,
    payment_city : type.STRING,
    payment_postcode : type.STRING,
    payment_country : type.STRING,
    payment_country_id : type.INTEGER,
    payment_zone : type.TEXT,
    payment_zone_id : type.INTEGER,
    payment_address_format : type.TEXT,
    payment_custom_field : type.TEXT,
    payment_method : type.STRING,
    payment_code : type.STRING,
    shipping_firstname : type.STRING,
    shipping_lastname : type.STRING,
    shipping_company : type.STRING,
    shipping_address_1 : type.STRING,
    shipping_address_2 : type.STRING,
    shipping_city : type.STRING,
    shipping_postcode : type.STRING,
    shipping_country : type.STRING,
    shipping_country_id : type.INTEGER,
    shipping_zone : type.STRING,
    shipping_zone_id : type.INTEGER,
    shipping_address_format : type.TEXT,
    shipping_custom_field : type.TEXT,
    shipping_method : type.STRING,
    shipping_code : type.STRING,
    comment : type.INTEGER,
    total : type.DECIMAL,
    order_status_id : type.INTEGER,
    affiliate_id : type.INTEGER,
    commission : type.DECIMAL,
    marketing_id: type.INTEGER,
    tracking: type.STRING,
    language_id: type.INTEGER,
    currency_id: type.INTEGER,
    currency_code: type.STRING,
    currency_value: type.DECIMAL,
    ip: type.STRING,
    forwarded_ip: type.STRING,
    user_agent: type.STRING,
    accept_language: type.STRING,
    date_added: type.DATE,
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
  tableName: 'oc_order'
});
