 

module.exports = (sequelize, type) => sequelize.define('prodToForme', {
    forme_id: {
      type: type.INTEGER,
      references: {
          model: 'forme', // 'persons' refers to table name
          key: 'forme_id', // 'id' refers to column name in persons table
       }
    },
    product_id: {
      type: type.INTEGER,
      references: {
          model: 'product', // 'persons' refers to table name
          key: 'product_id', // 'id' refers to column name in persons table
       }
    },
    sousCategory_id: {
      type: type.INTEGER,
      references: {
          model: 'souscategory', // 'persons' refers to table name
          key: 'sousCategory_id', // 'id' refers to column name in persons table
       }
    },
    dosage: type.STRING,
    
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
  tableName: 'prodToForme'
});
