var passport = require('passport');
var User = require('../tables/sequsr');
var Product = require('../tables/seqprod');
var Category = require('../tables/seqcategory');
var SousCategory = require('../tables/seqSousCat');


module.exports = (app) => {


  app.post('/geToCat', (req, res, next) => {    
    Category.findAll()
              .then((info) => {
              if (info != null) {
              console.log(info);
              res.status(200).send({              
                categories: info,              
              });
              } else {
                console.error('no categories exists in db');
                res.status(401).send('= no categories exists =');
              }
        });
  }); 
  app.post('/geToSubCat', (req, res, next) => {    
    SousCategory.findAll({
          where: {
            category_id: req.body.category_id,
          }   })
              .then((info) => {
              if (info != null) {
              console.log(info);
              res.status(200).send({              
                categories: info,              
              });
              } else {
                console.error('no categories exists in db');
                res.status(401).send('= no categories exists =');
              }
        });
  });


}