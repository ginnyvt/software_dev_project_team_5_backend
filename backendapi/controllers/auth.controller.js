const env = require("dotenv");
env.config();
const config = process.env.SECRET;
const db = require("../models");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (req.body.roles) {
      Role.find({ name: { $in: req.body.roles } }, (err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        user.roles = roles.map((role) => role._id);
        user.save((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          res.send({ message: "User was registered successfully!" });
        });
      });
    } else {
      Role.findOne({ name: "employee" }, (err, role) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          res.send({ message: "User was registered succesfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      var isValidPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!isValidPassword) {
        return res
          .status(401)
          .send({ accessToken: null, message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config, {
        expiresIn: 86400, //24 hours
      });

      var authorized = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorized.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roles: authorized,
        accessToken: token,
      });
    });
};
