const db = require("../models");

const ROLES = db.ROLES;
const User = db.user;

checkUsernameOrEmail = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: `Username (${req.body.username}) is already taken.`,
      });
      return;
    }
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: `Email ( ${req.body.email} )) is alread taken`,
        });
        return;
      }
      next();
    });
  });
};

checkRoles = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Role does not exisst:" + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

const CheckSignUp = {
  checkUsernameOrEmail: checkUsernameOrEmail,
  checkRoles: checkRoles,
};

module.exports = CheckSignUp;
