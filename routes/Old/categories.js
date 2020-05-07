var passport = require('passport');
var User = require('../tables/sequsr');
var Product = require('../tables/seqprod');
var ProdDesc = require('../tables/seqprod_desc')
var Category = require('../tables/seqcat');
var CatDesc = require('../tables/seqcat_desc');
var ProdTocat = require('../tables/seqprod_tocat')

module.exports = (app) => {


  app.post('/getCategoryByProd', (req, res, next) => {
      ProdTocat.belongsTo(Category, {foreignKey: 'category_id'})
      Category.hasMany(ProdTocat, {foreignKey: 'category_id'})  
      Category.hasOne(CatDesc)
      Category.belongsTo(Category, {foreignKey: 'category_id'})  
    ProdTocat.findOne({
          where: {
            product_id: 28,
          },
          include: [{model : Category, attributes:['category_id'], include:[CatDesc] }]
        }).then((prodInfo) => {
          if (prodInfo != null) {
            console.log(prodInfo);
            res.status(200).send({              
              products: prodInfo,
              
            });
          } else {
            console.error('no product exists in db with that name');
            res.status(401).send('no product exists in db with that name');
          }
        });
  });
  app.post('/getCategoryByTime', (req, res, next) => {      
      Category.hasOne(CatDesc,{foreignKey: 'category_id'})  
      CatDesc.belongsTo(Category, {foreignKey: 'category_id'})  

		Category.findAll({ 
            attributes:['category_id', 'image',"status",'parent_id'],
            where: {
              parent_id: req.body.category_id,
            },        
          include: [{model : CatDesc }]
        }).then((category) => {
          if (category != null) {
            console.log(category);
            res.status(200).send({              
              category: category,              
            });
          } else {
            console.error('no category exists in db with that name');
            res.status(401).send('no category exists in db with that name');
          }
        });
	});


  app.post('/findProdCategory', (req, res, next) => {
      Product.hasMany(ProdDesc, {foreignKey: 'product_id'})
      ProdDesc.belongsTo(Product, {foreignKey: 'product_id'})   

      Product.hasMany(ProdTocat, {foreignKey: 'product_id'})        
      ProdTocat.belongsTo(Product, {foreignKey: 'product_id'})

      Category.hasMany(ProdTocat, {foreignKey: 'category_id'})        
      ProdTocat.belongsTo(Category, {foreignKey: 'category_id'})

      Category.hasOne(CatDesc, {foreignKey: 'category_id'})
      CatDesc.belongsTo(Category, {foreignKey: 'category_id'})
      //Product.belongsToMany(Category, {through: 'oc_product_to_category'})
      console.log(req.body.category_id)
        ProdDesc.findAll({ 
          order: [['name', 'DESC']], include: [ {model : Product, attributes:['price', 'image','date_available', 'product_id'], 
            include:[{model:ProdTocat, where: {
              category_id: req.body.category_id,
            },  
              include:[{model:Category, attributes:['image','status','date_added', 'category_id'], 
          
                include:[{model:CatDesc, attributes:['category_id','name','description', 'language_id']

                }] }] }] } ], 
          limit:17, 
          attributes: ['product_id', 'name', 'description', 'tag', 'language_id'],  
          
        }).then((prodInfo) => {
          if (prodInfo != null) {
            //console.log(prodInfo);
            res.status(200).send({
              products: prodInfo,
                         
            });
          } else {
            console.error('no product exists in db with that name');
            res.status(401).send('no product exists in db with that name');
          }
        });
    });



}