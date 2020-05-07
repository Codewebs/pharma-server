 /* eslint-disable no-console */
var passport = require('passport');
var User = require('../tables/sequsr');
var Product = require('../tables/seqprod');
var Category = require('../tables/seqcat');
var CatDesc = require('../tables/seqcat_desc');
var ProdDesc = require('../tables/seqprod_desc');
var Sequelize = require('sequelize');
var ProdTocat = require('../tables/seqprod_tocat')
var Primage = require('../tables/seqpr_image')
var Cart = require('../tables/seqcart')
var Wish = require('../tables/seqwish')
const Op = Sequelize.Op

module.exports = (app) => {

  app.post('/findOneProduct', (req, res, next) => {
  
        Product.findOne({
          where: {
            product_id: 28,
          },
        }).then((prodInfo) => {
          if (prodInfo != null) {
            console.log('produces found in db from findProducts');
            res.status(200).send({              
              date_added: prodInfo.date_added,
              price: prodInfo.price,
              
            });
          } else {
            console.error('no product exists in db with that name');
            res.status(401).send('no product exists in db with that name');
          }
        });
    });


    app.post('/findProducts', (req, res, next) => {
      var io = req.app.io;
      
      //console.log(io)
      let data = req.body
      let l1 = 0 + 2*data.page // definition des limites de 5 en 5
      //let l2 = 5 * data.page
      
      
      //console.log('Je viens pour la '+data.page+" eme fois et je vais te send l'intervale ===>" + l1 )
      Product.hasOne(ProdDesc, {foreignKey: 'product_id'})
      ProdDesc.belongsTo(Product, {foreignKey: 'product_id'})   

      Product.hasMany(ProdTocat, {foreignKey: 'product_id'})        
      ProdTocat.belongsTo(Product, {foreignKey: 'product_id'})

      Category.hasMany(ProdTocat, {foreignKey: 'category_id'})        
      ProdTocat.belongsTo(Category, {foreignKey: 'category_id'})

      Category.hasOne(CatDesc, {foreignKey: 'category_id'})
      CatDesc.belongsTo(Category, {foreignKey: 'category_id'})

      Product.hasMany(Wish, {foreignKey:'product_id'})
      Wish.belongsTo(Product, {foreignKey:'product_id'})

      Product.hasMany(Cart, {foreignKey:'product_id'})
      Cart.belongsTo(Product, {foreignKey:'product_id'})
      //Product.belongsToMany(Category, {through: 'oc_product_to_category'})
      
        ProdDesc.findAll({ 
          order: [['name', 'DESC']], include: [ {model : Product, attributes:['price', 'image','date_available', 'product_id'], 
            include:[{model:ProdTocat, 
              include:[{model:Category, attributes:['image','status','date_added'] , 
                include:[{model:CatDesc, attributes:['category_id','name','description', 'language_id']

                }] }]}, {model:Wish, where:{customer_id:data.customer_id}, required:false},  {model:Cart, where:{customer_id:data.customer_id}, required:false } ] }], 
          limit:[l1, 2], 
          attributes: ['product_id', 'name', 'description', 'tag', 'language_id'],  
          
        }).then((prodInfo) => {
          if (prodInfo != null) {            
            res.status(200).send({
              products: prodInfo,
                         
            });
          } else {
            console.error('no product exists in db with that name');
            res.status(401).send('no product exists in db with that name');
          }
        });
    });

  app.post('/search', (req, res, next) => {
      var io = req.app.io;
      
      //console.log(io)
      let data = req.body
      let l1 = 0 + 2*data.page // definition des limites de 5 en 5
      //let l2 = 5 * data.page
      
      
      console.log(data)
      Product.hasOne(ProdDesc, {foreignKey: 'product_id'})
      ProdDesc.belongsTo(Product, {foreignKey: 'product_id'})   

      Product.hasMany(ProdTocat, {foreignKey: 'product_id'})        
      ProdTocat.belongsTo(Product, {foreignKey: 'product_id'})

      Category.hasMany(ProdTocat, {foreignKey: 'category_id'})        
      ProdTocat.belongsTo(Category, {foreignKey: 'category_id'})

      Category.hasOne(CatDesc, {foreignKey: 'category_id'})
      CatDesc.belongsTo(Category, {foreignKey: 'category_id'})

      Product.hasMany(Wish, {foreignKey:'product_id'})
      Wish.belongsTo(Product, {foreignKey:'product_id'})

      Product.hasMany(Cart, {foreignKey:'product_id'})
      Cart.belongsTo(Product, {foreignKey:'product_id'})
      //Product.belongsToMany(Category, {through: 'oc_product_to_category'})
      
        ProdDesc.findAll({ 
          attributes: ['product_id', 'name', 'description', 'tag', 'language_id'],
          order: [['name', 'DESC']],          
          include: [ {model : Product, attributes:['price', 'image','date_available', 'product_id'], 
            include:[{model:ProdTocat, 
              include:[{model:Category, attributes:['image','status','date_added'] , 
                include:[{model:CatDesc, attributes:['category_id','name','description', 'language_id']

                }] }]}, {model:Wish, where:{customer_id:data.customer_id}, required:false},  {model:Cart, where:{customer_id:data.customer_id}, required:false } ] }], 
          
          
          where: {name: {[Op.substring]: '%'+data.search}},           
        }).then((prodInfo) => {
          if (prodInfo != null) {               
            res.status(200).send({
              products: prodInfo,
                         
            });
          } else {
            console.error('no product exists in db with that name');
            res.status(401).send('no product exists in db with that name');
          }
        });
    });

  app.post('/getprimages', (req, res, next) => {
    var io = req.app.io;
      Product.hasMany(Primage, {foreignKey: 'product_id'})
      Primage.belongsTo(Product, {foreignKey: 'product_id'})   
      const data = {
            product_id: req.body.product_id,
            token: req.body.token,   
          };
         // console.log(data)
      //Product.belongsToMany(Category, {through: 'oc_product_to_category'})
      
        Primage.findAll({
            include: [ {model : Product, where: {product_id: data.product_id}, attributes:['product_id']
             }],                     
          
        }).then((primages) => {
          if (primages != null) {
            //console.log(primages);            
            res.status(200).send({
              primages: primages,
                         
            });
          } else {
            console.error('no primages exists in db with that name');
            res.status(401).send('no primages exists in db with that name');
          }
        });
    });


  } 