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
const Service = require('../tables/seqservice');
const Drink = require('../tables/seqdrink');
const ProdCompl = require('../tables/seqprod_complement');
const Complement = require('../tables/seqcomplement');
const Order_Drink = require('../tables/seqorder_drink');
const Order_Compl = require('../tables/seqorder_compl');

var Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (app) => {

app.post('/addorder', (req, res, next) => {

  
  let order_status_id //Defini le status << En attente de payement >>
  console.log(req.ip)
  //console.log(req.body.product.OrderProd)
  //console.log(req.body.product)

      Order.hasMany(OrderProd, {foreignKey: 'order_id'})
      OrderProd.belongsTo(Order, {foreignKey: 'order_id'})

  let data = req.body.product;
    
      return Order.create(data).then(function (order) {
        if (order) {
          console.log("j'ai deja fini ORDER")
          console.log(data.OrderProd)
          

          for (var i = 0; i < data.OrderProd.length; i++) {
            console.log('order de i ' + data.OrderProd[i].order_id)
            data.OrderProd[i].order_id = order.order_id            
            console.log('fin de order de i ' + data.OrderProd[i].order_id)
          }
          data.OrderTotal[0].order_id = order.order_id
          data.Delivery.order_id = order.order_id          
          //console.log(data.OrderTotal)
           OrderProd.bulkCreate(data.OrderProd).then(function (orderprod) {
            if(orderprod){ // *****************************************************
              console.log("j'ai fini ORDERPROD")
               OrderTotal.create(data.OrderTotal[0]).then(function (ordertotal) {
                if(ordertotal){
                  
                   Delivery.create(data.Delivery).then(function (delivery) {
                    if(delivery){
                      res.send({msg:"Save successfully",
                            obj:ordertotal})    
                    }
                  })                  
                }

              })
            } //*******************************************************

          })
          
        } else {
         res.status(400).send('Error in insert new record');
        }
      });
    
});
app.post('/addPayment', (req, res, next) => {
  //console.log(req.body)
  var io = req.app.io;
  let status = 2
  let data = req.body;
  let socket_id = data.socket_id;
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
app.post('/findchannel', (req, res, next) => { 
  //console.log(req.body)
  var io = req.app.io;
  
  let data = req.body;
  console.log(data)
  let socket_id = data.socket_id;
     Delivery.findAll({
          where: {
            customer_id:data.user_id,
            status:2,
            seen:0,
          },
        }).then((delivery) => {
          if(delivery){
            io.emit('my channel', delivery.channel)
          }else{
            res.status(401).send('You have no order in process')
          }          
        })
  
    
});


app.post('/geToOrder', (req, res, next) => {
      Order.hasMany(OrderProd, {foreignKey: 'order_id'})
      OrderProd.belongsTo(Order, {foreignKey: 'order_id'})   

      Order.hasOne(OrderTotal, {foreignKey: 'order_id'})
      OrderTotal.belongsTo(Order, {foreignKey: 'order_id'})

      Customer.hasOne(Order, {foreignKey: 'customer_id'})
      Order.belongsTo(Customer, {foreignKey: 'customer_id'})

      Order.hasOne(OrderOption, {foreignKey: 'order_id'})
      OrderOption.belongsTo(Order, {foreignKey: 'order_id'})
      
      Product.hasMany(OrderProd, {foreignKey: 'product_id'})
      OrderProd.belongsTo(Product, {foreignKey: 'product_id'})   

      Product.hasOne(ProdDesc, {foreignKey: 'product_id'})
      ProdDesc.belongsTo(Product, {foreignKey: 'product_id'})   
      
      Order.hasOne(Delivery, {foreignKey:'order_id'});
      Delivery.hasOne(Order, {foreignKey:'order_id'});

      data = req.body
      console.log(data.user.customer_id)
      if(data.user.isAuthenticated){
      Order.findAll({
            include: [ {model : OrderProd,
              include: [{model:Product,include: [{model:ProdDesc}] }]
          },{model:OrderTotal}, {model:Delivery, required:false}],                     
          where: { customer_id: data.user.customer_id}

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
      }else{
      
      Order.findAll({
            include: [ {model : OrderProd,
              include: [{model:Product,include: [{model:ProdDesc}] }]
          },{model:OrderTotal}, {model:Delivery, required:false}],                     
          where: {telephone: data.user.customer_id                
        }

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
      }
});



  app.post('/cancelToOrder', (req, res, next) => { // Il s'agit d'annuler
    let data = req.body;
        Cart.update({status:data.status},{
           where: {              
              order_id: data.order_id,
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

