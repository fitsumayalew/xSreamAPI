const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var randomstring = require("randomstring");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ $or: [{ phone: req.body.phone }, { username: req.body.username }] })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Phone number or Username exists"
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          phone: req.body.phone,
          username: req.body.username,
        });
        user
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: "User created"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });

      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ phone: req.body.phone })
    .exec()
    .then(user => {
      console.log(req.body.phone);
      if (user.length < 1) {
        console.log();
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          phone: req.body.phone,
          username: randomstring.generate(7),
        });
        user
          .save()
          .then()
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
      const token = jwt.sign(
        {
          phone: user[0].phone,
          id: user[0]._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "7d"
        }
      );
      return res.status(200).json({
        message: "Auth successful",
        token: token
      });
    });
};


exports.user_profile = (req,res,next) => {
  User.find({ _id: req.userData.id})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(403).json({
          error: "Invalid Token"
        });
      }

 

      return res.status(200).json(user[0]);
    });
}


exports.user_profile_update = (req,res,next) => {
  User.find({ _id: req.userData.id})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(403).json({
          error: "Invalid Token"
        });
      }

      User.findOneAndUpdate({_id: req.userData.id},req.body,{new: true})
      .exec()
      .then(user=>{
        return res.status(200).json({
          message: "Updated successfully",
          user: user
        });
      });

      
    });
}



//For testing purposes
exports.get_users = (req, res, next) => {
  User.find()
    .select("phone username _id avatar")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            name: doc.username,
            phone: doc.phone,
            avatar: doc.avatar,
            _id: doc._id
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};