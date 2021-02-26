const db = require("../models");
const userRoutes = require("../routes/user.routes");
const User = db.user;
const Op = db.Sequlize.Op;

exports.allAccess = (req, res) => {
  res.status(200).send("Public");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Hello user, sup??");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("You must be administrator, aligatorrorororo.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Elevator operator MODERATOR");
};

// return all users
exports.allUsers = (req, res) => {
  const username = req.query.username; //req.query.name stojalo
  var condition = username ? {username: {[Op.like]: `%${username}%`}} : null;
  console.log(username);
  User.findAll({where: condition})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errror occur while retriving users",
      });
    });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: {id: id},
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Does it even exists?!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User userid=" + id,
      });
    });
};

//return user with username
exports.findOne = (req, res) => {
  //const username = req.query.name;
  const id = req.params.id; // api/test/users/1  id
  //const username = req.params.username; // api/test/users/1  id

  User.findByPk(id)
    //User.findOne({where: {id}})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Errror while retriving user--->>${username}`,
      });
    });
};
