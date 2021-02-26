const db = require("../models");
const config = require("../config/auth.config");

const User = db.user;
const Role = db.role;

const Op = db.Sequlize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    //synchornosly create hash for single string
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({message: "Sign up complete!"});
          });
        });
      } else {
        user.setRoles([1]).then(() => {
          res.send({message: "Sign up complete (User)"});
        });
      }
    })
    .catch((err) => {
      res.status(500).send({message: "err.message"});
    });
};

exports.signIn = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      var validPassword = bcrypt.compareSync(req.body.password, user.password);

      if (!validPassword) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password",
        });
      }

      var token = jwt.sign({id: user.id}, config.secret, {
        expiresIn: 86400,
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({message: err.message});
    });
};

/*

POST
localhost:8080/api/auth/signup
{
    "username":"admin",
    "email":"admin@gmail.com",
    "password":"admin123",
    "roles":["admin"]
}

POST
localhost:8080/api/auth/signin
{
    "username":"mito",
    "password":"tomitomi"   
}

*/
