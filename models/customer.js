 
module.exports = (sequelize, type) => sequelize.define('customer', {
    customer_id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    language_id: type.INTEGER,
    firstname: type.STRING,
    lastname: type.STRING,    
    email: {
      type: type.STRING,
      allowNull: false,
    },
    telephone: {
      type: type.STRING,
      allowNull: false,
    },
    password: {
      type: type.STRING,
      allowNull: false,
    },
    salt: type.STRING,    
    wishlist: type.TEXT,    
    ip: type.STRING,    
    status: type.TINYINT,
    token: type.TEXT,    
    date_added:type.DATE,
    resetPasswordToken: type.STRING,
    resetPasswordExpires: type.DATE,
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
  tableName: 'customer'
});
