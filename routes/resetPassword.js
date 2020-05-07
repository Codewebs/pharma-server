 /* eslint-disable no-console */
/* eslint-disable max-len */
var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');
var User = require('../tables/sequsr');

// eslint-disable-next-line prefer-destructuring
const Op = Sequelize.Op;

/**
 * @swagger
 * /reset:
 *   get:
 *     tags:
 *       - Users
 *     name: Reset Password Link
 *     summary: Create validation string in reset password link to verify user's allowed to reset their password
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: resetPasswordToken
 *         in: query
 *         schema:
 *           type: string
 *         required:
 *           - resetPasswordToken
 *     responses:
 *       '200':
 *         description: User's password reset link is valid
 *       '403':
 *         description: Password reset link is invalid or has expired
 */
const BCRYPT_SALT_ROUNDS = 12;
const nodemailer = require('nodemailer');

module.exports = (app) => {

  // ------------------- Reset du mot de passe
  app.get('/reset', (req, res) => {
    User.findOne({
      where: {
        resetPasswordToken: req.query.resetPasswordToken,
        resetPasswordExpires: {
          [Op.gt]: Date.now(),
        },
      },
    }).then((user) => {
      if (user == null) {
        console.error('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired');
      } else {
        res.status(200).send({
          username: user.username,
          message: 'password reset link a-ok',
        });
      }
    });
  });

// ---------------------- Modification du Paassword par email ---------------------

   app.put('/updatePasswordViaEmail', (req, res) => {
    User.findOne({
      where: {
        username: req.body.username,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExpires: {
          [Op.gt]: Date.now(),
        },
      },
    }).then(user => {
      if (user == null) {
        console.error('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired');
      } else if (user != null) {
        console.log('user exists in db');
        bcrypt
          .hash(req.body.password, BCRYPT_SALT_ROUNDS)
          .then(hashedPassword => {
            user.update({
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null,
            });
          })
          .then(() => {
            console.log('password updated');
            res.status(200).send({ message: 'password updated' });
          });
      } else {
        console.error('no user exists in db to update');
        res.status(401).json('no user exists in db to update');
      }
    });
  });


// ------------------------ Modification du password ------------------------------
     app.put('/updatePassword', (req, res, next) => {
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
            bcrypt
              .hash(req.body.password, BCRYPT_SALT_ROUNDS)
              .then((hashedPassword) => {
                userInfo.update({
                  password: hashedPassword,
                });
              })
              .then(() => {
                console.log('password updated');
                res
                  .status(200)
                  .send({ auth: true, message: 'password updated' });
              });
          } else {
            console.error('no user exists in db to update');
            res.status(404).json('no user exists in db to update');
          }
        });
      }
    })(req, res, next);
  });


// --------------------- Password oublié 
 app.post('/forgotPassword', (req, res) => {
    if (req.body.email === '') {
      res.status(400).send('email required');
    }
    console.error(req.body.email);
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user === null) {
        console.error('email not in database');
        res.status(403).send('email not in db');
      } else {
        const token = crypto.randomBytes(20).toString('hex');
        user.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 360000,
        });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
          },
        });

        const mailOptions = {
          from: 'mySqlDemoEmail@gmail.com',
          to: `${user.email}`,
          subject: 'Link To Reset Password',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `http://localhost:3031/reset/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.status(200).json('recovery email sent');
          }
        });
      }
    });
  });
};
