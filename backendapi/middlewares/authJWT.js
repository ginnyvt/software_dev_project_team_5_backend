const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();
const config = process.env.SECRET;
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, config, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "UNAUTHORIZED" });
    }
    req.userId = decoded.id;
    next();
  });
};

isEmployee = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    Role.find({ _id: { $in: user.roles } }, (err, roles) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "employee") {
          next();
          return;
        }
      }
      return res.status(403).send({ message: "Required Employee Role!" });
    });
  });
};

isEmployer = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    Role.find({ _id: { $in: user.roles } }, (err, roles) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "employer") {
          next();
          return;
        }
      }
      return res.status(403).send({ message: "Require Employer Role!" });
    });
  });
};

const authJwt = { verifyToken, isEmployee, isEmployer };

module.exports = authJwt;
