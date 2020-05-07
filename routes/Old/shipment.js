 /* eslint-disable no-console */
var passport = require('passport');
var User = require('../tables/sequsr');
var Product = require('../tables/seqprod');
var Category = require('../tables/seqcat');
var CatDesc = require('../tables/seqcat_desc');
var ProdDesc = require('../tables/seqprod_desc');
var sequelize = require('sequelize');
var ProdTocat = require('../tables/seqprod_tocat')
var Cart = require('../tables/seqcart');
const Order = require('../tables/seqorder');
const OrderProd = require('../tables/seqorder_prod')
const Customer = require('../tables/seqcustomer');
const OrderOption = require('../tables/seqorder_option');
const OrderTotal = require('../tables/seqord_total')
const Delivery = require('../tables/seqdeliv_ligne')

module.exports = (app) => {


app.post('/geToOrderShip', (req, res, next) => {
      Order.hasMany(OrderProd, {foreignKey: 'order_id'});
      OrderProd.belongsTo(Order, {foreignKey: 'order_id'});

      Order.hasOne(OrderTotal, {foreignKey: 'order_id'});
      OrderTotal.belongsTo(Order, {foreignKey: 'order_id'});

      Customer.hasOne(Order, {foreignKey: 'customer_id'});
      Order.belongsTo(Customer, {foreignKey: 'customer_id'});

      Order.hasOne(OrderOption, {foreignKey: 'order_id'});
      OrderOption.belongsTo(Order, {foreignKey: 'order_id'});
      
      Product.hasMany(OrderProd, {foreignKey: 'product_id'});
      OrderProd.belongsTo(Product, {foreignKey: 'product_id'});

      Product.hasOne(ProdDesc, {foreignKey: 'product_id'});
      ProdDesc.belongsTo(Product, {foreignKey: 'product_id'});
      
      Order.hasMany(Delivery, {foreignKey:'order_id'});
      Delivery.belongsTo(Order, {foreignKey:'order_id'});
      
      data = req.body
      
      
      Order.findAll({
            include: [ {model : OrderProd,
              include: [{model:Product,include: [{model:ProdDesc}] }]
          },{model:OrderTotal}, {model:Delivery, where:{driver_id:2}, required:false}],                     
          where: {order_status_id: 2}
        }).then((orders) => {
          if (orders != null) {
            //console.log(orders);
            res.status(200).send({
              order_items: orders,                         
            });
          } else {
            console.error('no items exists in Orders with that name');
            res.status(401).send('no items exists in Orders with that name');
          }
        });
    });


app.post('/startShipping', (req, res, next) => { 
  console.log(req.body)
  var io = req.app.io;
  let status = 2 
  let data = req.body;
  let socket_id = data.socket_id;
  for (var i = 0; i < data.orders.length; i++) {
    Order.update({status:data.status},{
      where: {
        order_id: data.orders[i].order_id,
      }
    }).then(function(order){
        return Delivery.create(data.orders[i]).then(function (orders) {
          io.to(socket_id).emit("action", {
            type:"START SHIPPING",
            payload:order
          });
          io.to(socket_id).emit("startShipping", "Shippement start \n We will ");
            if(orders){
              io.to("channel").emit("startShipping", "Shippement start \n We will ");
            }
        })
        
          // console.log(order)
      }, function(err){
        console.log(err); 
      });

  }
  if(data.status == "Failed")
      status = 10
        Order.update({status:data.status},{
          where: {
            order_id: data.order_id,
          }
        }).then(function(order){
             io.to(socket_id).emit("action", {
                    type:"PAYMENT_STATE",
                    payload:order
             });
          io.to(socket_id).emit("payment", "payment done and registered \n We will notified you in few minutes");
          // console.log(order)
        }, function(err){
            console.log(err); 
        });
    
});



} 

