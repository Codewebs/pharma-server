 /* eslint-disable no-console */
var jwt = require('jsonwebtoken');
var passport = require('passport');
var jwtSecret = require('../config/jwtConfig');
var User = require('../tables/sequsr');
var Customer = require('../tables/seqcustomer');
/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     tags:
 *       - Users
 *     name: Delete User
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         in: query
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: string
 *         required:
 *           - username
 *     responses:
 *       '200':
 *         description: User deleted from db
 *       '403':
 *         description: Authentication error
 *       '404':
 *         description: No user in db with that name
 *       '500':
 *         description: Problem communicating with db
 */

module.exports = (app) => {
  app.post('/registerUser', (req, res, next) => {    
    passport.authenticate('register', (err, user, info) => {    
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {        
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        // eslint-disable-next-line no-unused-vars
        req.logIn(user, error => {          
          const data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            telephone: req.body.telephone,
            firstname: user.firstname,
            lastname: user.lastname,
          };

          console.log('-------------->');
          console.log(data);
          Customer.findOne({
            where: {
              telephone: data.telephone,
            },
          }).then(customer => {
            console.log(customer);
            customer
              .update({
                firstname: data.firstname,
                lastname: data.lastname,
                telephone: data.telephone,
              })
              .then((customer) => {
                console.log('user created in db');
                res.status(200).send({ message: 'user created', customer:customer });
              });
          });
        });
      }
    })(req, res, next);
  });

  app.post('/loginUser', (req, res, next) => {
    passport.authenticate('login', (err, users, info) => {
      if (err) {
        console.error(`error ${err}`);
      }
      if (info !== undefined) {
        console.error(info.message);
        if (info.message === 'bad username') {
          res.status(401).send(info.message);
        } else {
          res.status(403).send(info.message);
        }
      } else {
        req.logIn(users, () => {
          Customer.findOne({
            where: {
              telephone: req.body.username,
            },
          }).then(user => {
            console.log(user.telephone)
            const token = jwt.sign({ id: user.id }, jwtSecret.secret, {
              expiresIn: 60 * 60,
            });
            res.status(200).send({
              auth: true,
              token,
              telephone:user.telephone,
              email:user.email,
              language_id:user.language_id,
              customer_group_id:user.customer_group_id,
              firstname:user.firstname,
              lastname:user.lastname,
              customer_id:user.customer_id,
              ip:user.ip,
              address_id:user.address_id,
              status:user.status,
              date_added:user.date_added,
              message: 'user found & logged in',
            });
          });
        });
      }
    })(req, res, next);
  });


  app.get('/findUser', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {
        console.log(info.message);
        res.status(401).send(info.message);
      } else if (user.username === req.query.username) {
        User.findOne({
          where: {
            username: req.query.username,
          },
        }).then((userInfo) => {
          if (userInfo != null) {
            console.log('user found in db from findUsers');
            res.status(200).send({
              auth: true,
              first_name: userInfo.first_name,
              last_name: userInfo.last_name,
              email: userInfo.email,
              username: userInfo.username,
              password: userInfo.password,
              message: 'user found in db',
            });
          } else {
            console.error('no user exists in db with that username');
            res.status(401).send('no user exists in db with that username');
          }
        });
      } else {
        console.error('jwt id and username do not match');
        res.status(403).send('username and jwt token do not match');
      }
    })(req, res, next);
  });


  app.delete('/deleteUser', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        User.destroy({
          where: {
            username: req.query.username,
          },
        })
          .then((userInfo) => {
            if (userInfo === 1) {
              console.log('user deleted from db');
              res.status(200).send('user deleted from db');
            } else {
              console.error('user not found in db');
              res.status(404).send('no user with that username to delete');
            }
          })
          .catch((error) => {
            console.error('problem communicating with db');
            res.status(500).send(error);
          });
      }
    })(req, res, next);
  });

    app.put('/updateUser', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        User.findOne({
          where: {
            username: req.body.username,
          },
        }).then((userInfo) => {
          if (userInfo != null) {
            console.log('user found in db');
            userInfo
              .update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
              })
              .then(() => {
                console.log('user updated');
                res.status(200).send({ auth: true, message: 'user updated' });
              });
          } else {
            console.error('no user exists in db to update');
            res.status(401).send('no user exists in db to update');
          }
        });
      }
    })(req, res, next);
  });


};
