const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/keys").secret;
const User = require("../../models/User");
const {isEmpty} = require("../../validation/isEmpty");

router.post("/login", (req, res) => {
    const {email, password} = req.body;

    if(isEmpty(email)) {
      return res.status(400).json(
          {
              message: `Empty email id sent as argument`
          }
      )
  }

  if(isEmpty(password)) {
    return res.status(400).json(
        {
            message: `Empty password sent as argument`
        }
    )
}

    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(400).json({
          message: `Invalid credentials`
        });
      }

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = { id: user.id, name: user.name, role:user.role };
          jwt.sign(payload, key, { expiresIn: 3600 }, (err, _token) => {
            if(err) {
              res.status(400).json(err);
            }
            res.cookie('jwt',_token); // add cookie here
            res.redirect('/home');
          });
        } else {
          return res.status(400).json({
            message: `Invalid credentials`
          });
        }
      });
    });
  });
  
router.post("/register", (req, res) => {

  const {name, email, password, role} = req.body;
  if(isEmpty(name)) {
    return res.status(400).json(
        {
            message: `Name argument sent are empty`
        }
    )
  }
  if(isEmpty(email)) {
    return res.status(400).json(
        {
            message: `Email argument sent are empty`
        }
    )
  }
  if(isEmpty(password)) {
    return res.status(400).json(
        {
            message: `Password argument sent are empty`
        }
    )
  }
  if(isEmpty(role)) {
    return res.status(400).json(
        {
            message: `Role argument sent are empty`
        }
    )
  }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(200).json({message: `User already exists`});
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.redirect("/login"))
              .catch(err => res.status(500).json(err));
          });
        });
      }
    });
  });

module.exports = router;