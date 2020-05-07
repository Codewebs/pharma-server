 /* eslint-disable no-console */
var passport = require('passport');
var User = require('../tables/sequsr');
var Product = require('../tables/seqprod');
var Category = require('../tables/seqcat');
var CatDesc = require('../tables/seqcat_desc');
var ProdDesc = require('../tables/seqprod_desc');
var sequelize = require('sequelize');
var ProdTocat = require('../tables/seqprod_tocat')
var Cart = require('../tables/seqcart')
var Wish = require('../tables/seqwish')

module.exports = (app) => {

app.post('/setItemCart', (req, res, next) => {

  let data = req.body;
console.log(data)
          Cart.findOne({
          where: {
            product_id: data.product_id,
            customer_id:data.user_id,
          },
        }).then((items) => {          
          if (items != null) {
              Cart.update(
                  { quantity: data.quantity},
                  { where: { product_id: data.product_id, customer_id:data.user_id } }
                ).then(result =>
                  res.status(200).send(result)
                )
                .catch(err =>
                  handleError(err)
                )
            
          } else {            
               return Cart.create({
                  cart_id:'',
                  api_id:0,
                  customer_id: data.user_id,
                  product_id: data.product_id,
                  quantity: data.quantity,
                  option:"4",
                  session_id:"4212e156a1cd8d9a7f05a64b87",
                  recurring_id:0,
                  date_added:'2019-11-15 03:21:26',

              }).then(function (cart){
                console.log(cart.dataValues)
                  if (cart){
                      res.send(cart);
                  } else {
                      res.status(400).send('Error in insert new record');
                  }
              });
          }

        });
    
});

app.post('/geToCart', (req, res, next) => {

      data = req.body      
      
      Product.hasOne(ProdDesc, {foreignKey: 'product_id'})
      ProdDesc.belongsTo(Product, {foreignKey: 'product_id'})   

      Product.hasMany(ProdTocat, {foreignKey: 'product_id'})        
      ProdTocat.belongsTo(Product, {foreignKey: 'product_id'})

      Category.hasMany(ProdTocat, {foreignKey: 'category_id'})        
      ProdTocat.belongsTo(Category, {foreignKey: 'category_id'})

      Category.hasOne(CatDesc, {foreignKey: 'category_id'})
      CatDesc.belongsTo(Category, {foreignKey: 'category_id'})
      

      Product.hasMany(Cart, {foreignKey:'product_id'})
      Cart.belongsTo(Product, {foreignKey:'product_id'})

      ProdDesc.hasMany(Cart, {foreignKey:'product_id'})
      Cart.belongsTo(ProdDesc, {foreignKey:'product_id'})

      Product.hasMany(Wish, {foreignKey:'product_id'})
      Wish.belongsTo(Product, {foreignKey:'product_id'})
      //Product.belongsToMany(Category, {through: 'oc_product_to_category'})
      
        Cart.findAll({ 
          order: [['cart_id', 'DESC']], include: [{ model: ProdDesc,
            include: [{model : Product, attributes:['price', 'image','date_available', 'product_id'], 
              include:[{model:ProdTocat, 
                include:[{model:Category, attributes:['image','status','date_added'] , 
                  include:[{model:CatDesc, attributes:['category_id','name','description', 'language_id']

                }] }]}, {model:Wish}
                ] }] }],
                where:{customer_id:data.customer_id} ,
          
          
        }).then((carts) => {
          if (carts != null) {
            //console.log(carts);
            res.status(200).send({
              cart_items: carts,                         
            });
          } else {
            console.error('no items exists in carts with that name');
            res.status(401).send('no items exists in carts with that name');
          }
        });
});

  app.post('/deleteToCart', (req, res, next) => {
    console.log("Effacer la recette du panier")
    let data = req.body;
        Cart.destroy({
           where: {
              customer_id: data.user_id,
              product_id: data.product_id,
           }
        }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
          if(rowDeleted === 1){
             console.log('Deleted successfully');
             res.status(200).send({
              message: "Deleted successfully",                         
            });
           }
        }, function(err){
            console.log(err); 
        });

  });
  app.post('/deleteAllToCart', (req, res, next) => {
    console.log("Effacer Tout du panier")
    let data = req.body;
        Cart.destroy({
           where: {
              customer_id: data.user_id,              
           }
        }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
          if(rowDeleted === 1){
             console.log('Deleted successfully');
           }
        }, function(err){
            console.log(err); 
        });

  });

  } 