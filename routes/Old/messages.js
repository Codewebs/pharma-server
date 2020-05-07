 /* eslint-disable no-console */
var passport = require('passport');
var User = require('../tables/sequsr');
var Product = require('../tables/seqprod');
var Sequelize = require('sequelize');
var Category = require('../tables/seqcat');
var CatDesc = require('../tables/seqcat_desc');
var ProdDesc = require('../tables/seqprod_desc');

var ProdTocat = require('../tables/seqprod_tocat')
var Cart = require('../tables/seqcart')
var Message = require('../tables/seqmessage')
var Wish = require('../tables/seqwish')
const Customer = require('../tables/seqcustomer');
const Service = require('../tables/seqservice');
const Drink = require('../tables/seqdrink');
const ProdCompl = require('../tables/seqprod_complement');
const Complement = require('../tables/seqcomplement');
const Order_Drink = require('../tables/seqorder_drink');
const Order_Compl = require('../tables/seqorder_compl');

module.exports = (app) => {
const Op = Sequelize.Op

app.post('/getOneMessage', (req, res, next) => {

  let data = req.body;
console.log(data)
          Message.findOne({
          where: {
            message_id: data.message_id,            
          },
        }).then((items) => {         
          if (items != null) {
              //-------------------------
            
          }else{
               
               //-----------------
          }

        });    
});

app.post('/getOneConcersation', (req, res, next) => {
var io = req.app.io;
//console.log(io.sockets)
 io.emit("action", {
                    type:"ADD_ONE_MESSAGE",
                    payload:{zer:"full"}
                });

io.on('subscribe', function(room) { 
        console.log('joining room', room);
        io.join(room); 
        io.emit('room',"Your are welcome on our room")
    })
  let data = req.body;
console.log(data)
        Customer.hasMany(Message, {foreignKey:'receiver'})
        Message.belongsTo(Customer, {foreignKey:'receiver'})

        Message.findAll({ 
          order: [['message_id', 'DESC']], include: [{ model: Customer,where: {telephone: data.me}, required:false}],
                where:{
                        [Op.or]: [{sender: data.me, receiver:data.other},
                        {sender:data.other, receiver: data.me},],                     
                   },
          
        }).then((messages) => {
          if (messages != null && messages !== null && messages != [] && messages !== [] && messages.length > 0) {
           // console.log(messages);
            res.status(200).send({messages: messages,});
          } else {
            console.error('no items exists in messages with that name');
            res.status(401).send('no exists in messages with that name');
          }
        });
   
});

app.post('/geToMessage', (req, res, next) => {
      data = req.body       
      Product.hasMany(Wish, {foreignKey:'product_id'})
      Wish.belongsTo(Product, {foreignKey:'product_id'})      
      Message.belongsTo(Customer,{foreignKey: 'sender_id'});
        Message.findAll({ 
          order: [['message_id', 'DESC']], include: [{ model: Customer}],
                where:{ [Op.or]: [{sender: 1}, {receiver: 1}] },
                group: ['receiver','sender']
          
        }).then((messages) => {
          if (messages != null && messages !== null && messages != [] && messages !== [] && messages.length > 0) {
            console.log(messages);
            res.status(200).send({
              messages: messages,
            });
          } else {
            console.error('no items exists in messages with that name');
            res.status(401).send('no items exists in messages with that name');
          }
        });
});


  app.post('/geTopMenu', (req, res, next) => {
    var io = req.app.io;
    let data = req.body;
    //console.log(data)
     //if (!data.user_id) return;
      Product.hasOne(ProdDesc, {foreignKey: 'product_id'})
      ProdDesc.belongsTo(Product, {foreignKey: 'product_id'})   

      Product.hasMany(ProdTocat, {foreignKey: 'product_id'})        
      ProdTocat.belongsTo(Product, {foreignKey: 'product_id'})

        Service.findAll({ 
          order: [['name', 'ASC']],
          where:{language_id:data.language_id, parent_id:data.level}
        }).then((service) => {
          if (service != null && service !== null && service != [] && service !== [] && service.length > 0) {
            //console.log(service);
            res.status(200).send({service});
          } else {
            console.error('no items exists in messages with that name');
            res.status(401).send('no exists in messages with that name');
          }
        });

  });
  app.post('/getDrinks', (req, res, next) => {
    var io = req.app.io;
    let data = req.body;      

        Drink.findAll({           
          where:{language_id:data.language_id, status:1}
        }).then((drinks) => {
          if (drinks != null && drinks !== [] && drinks.length > 0) {
            //console.log(service);
            res.status(200).send({drinks});
          } else {
            console.error('no items drinks exists in messages with that name');
            res.status(401).send('no drinks in messages with that name');
          }
        });

  });  
  app.post('/getMenu', (req, res, next) => {
    var io = req.app.io;
    let data = req.body;
    //console.log(data)
     //if (!data.user_id) return;
      Product.hasOne(ProdDesc, {foreignKey: 'product_id'})
      ProdDesc.belongsTo(Product, {foreignKey: 'product_id'})   

      Product.hasMany(ProdTocat, {foreignKey: 'product_id'})        
      ProdTocat.belongsTo(Product, {foreignKey: 'product_id'})

      ProdDesc.hasMany(ProdCompl, {foreignKey:'product_id'})
      ProdCompl.belongsTo(ProdDesc, {foreignKey:'product_id'})

      Complement.hasMany(ProdCompl, {foreignKey:'complement_id'})
      ProdCompl.belongsTo(Complement, {foreignKey:'complement_id'})

        ProdDesc.findAll({ 
          order: [['name', 'DESC']],
          include: [ {model : Product, attributes:['price', 'image','date_available', 'product_id'] },
                     {model : ProdCompl, include:[{model:Complement}] }],
          attributes: ['product_id', 'name', 'description', 'tag', 'language_id'], 
          limit:[0,3],
        }).then((menus) => {
          if (menus != null && menus !== null && menus != [] && menus !== [] && menus.length > 0) {
            //console.log(menus);
            res.status(200).send({menus: menus,});
          } else {
            console.error('no items exists in messages with that name');
            res.status(401).send('no exists in messages with that name');
          }
        });

  });

  app.post('/addOneMessage', (req, res, next) => {
    var io = req.app.io;
    let data = req.body;
    //console.log(data)
     //if (!data.user_id) return;
    let messageData = {
      sender: data.message.sender,
      receiver: data.message.receiver,
      Text: data.message.location ? "You sent your position": data.message.text,      
      date_added: new Date(data.message.date_added),      
      seen:data.message.seen,
      latitude:data.message.location ? data.message.location.latitude : null,
      longitude:data.message.location ? data.message.location.latitude: null,
    };    
    return Message.create(messageData).then(function (message) {
      console.log('done for : '+ ''+data.message.receiver)
      //io.emit('msg'+data.message.receiver,data.message.text)
      io.emit(data.message.receiver,message)
    });

  }); 
  app.post('/deleteToMessage', (req, res, next) => {
    console.log("Effacer la recette du panier")
    let data = req.body;
        Message.destroy({
           where: {
              receiver: data.user_id,              
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