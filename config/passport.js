/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');
var jwtSecret = require('./jwtConfig');
var sha1 = require('sha1');

const BCRYPT_SALT_ROUNDS = 9;
// eslint-disable-next-line prefer-destructuring
const Op = Sequelize.Op;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
var User = require('../tables/sequsr');
var Customer = require('../tables/seqcustomer');
passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'telephone',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    (req, telephone, password, done) => {
      try {
        Customer.findOne({
          where: {
            [Op.or]: [
              {
                telephone,
              },
              //{ email: req.body.email },
            ],
          },
        }).then(user => {
          if (user != null) {
            console.log('telephone or email already taken');
            return done(null, false, {
              message: 'telephone or email already taken',
            });
          }
          let salt = makeid(BCRYPT_SALT_ROUNDS)
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
            password = sha1(salt + sha1(salt+ sha1(password)))
            Customer.create({              
              telephone,
              store_id: req.body.lastname,
              language_id: 1,
              password: password,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: 'user@tchop.cm',
              fax: '',              
              salt: salt,
              cart: '',
              wishlist: '',
              newsletter:  0 ,
              address_id: 1,
              status: 1,
              custom_field: '',
              ip: req.ip,
              safe: 0,
              code: '',
              token: 'user',              
              date_added: new Date().getDate(),              
            }).then(user => {
              console.log('customer created');
              return done(null, user);
            });
          }); 
        });
      } catch (err) {
        return done(err);
      }
    },
  ),
);
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
function strcmp(a, b) {
    if (a.toString() < b.toString()) return -1;
    if (a.toString() > b.toString()) return 1;
    return 0;
}
passport.use('login', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (telephone, password, done) => {
      console.log(telephone)
      try {
        Customer.findOne({
          where: {telephone,},
        }).then(user => {
          if (user === null) {
            return done(null, false, { message: 'mauvais username' });
          }
          password = sha1(user.salt + sha1(user.salt+ sha1(password)))                
            if (password !== user.password) {
              console.log('Le password ne correspond pas');
              return done(null, false, { message: ' Les passwords ne correspondent pas' });
            }
            console.log('user found & authenticated');
            return done(null, user);
          
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret.secret,
};

passport.use(
  'jwt',
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      Customer.findOne({
        where: {
          id: jwt_payload.id,
        },
      }).then(user => {
        if (user) {
          console.log('user found in db in passport');
          done(null, user);
        } else {
          console.log('user not found in db');
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  }),
);
