const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Artist = require("../models/artist");

exports.artist_signup = (req, res, next) => {
  Artist.find({ $or : [{phone: req.body.phone},{username: req.body.username}] })
    .exec()
    .then(artist => {
      if (artist.length >= 1) {
        return res.status(409).json({
          message: "Phone number or Username exists"
        });
      } else {
            const artist = new Artist({
              _id: new mongoose.Types.ObjectId(),
              phone: req.body.phone,
              username: req.body.username,
              name: req.body.name,
              bio: req.body.bio,
              artistImage: req.file.path
            });
            artist
              .save()
              .then(result => {
                res.status(201).json({
                  message: "Artist created"
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



exports.artist_login = (req, res, next) => {
  Artist.find({ phone: req.body.phone })
    .exec()
    .then(artist => {
      if (artist.length < 1) {
        const artist = new Artist({
          _id: new mongoose.Types.ObjectId(),
          phone: req.body.phone,
          name: "Lil nas X"
        });
        artist
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
          phone: artist[0].phone,
          id: artist[0]._id
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


exports.artist_profile = (req,res,next) => {
  Artist.find({ _id: req.userData.id})
    .exec()
    .then(artist => {
      if (artist.length < 1) {
        return res.status(403).json({
          error: "Invalid Token"
        });
      }
      return res.status(200).json(artist[0]);
    });
}


exports.artist_profile_update = (req,res,next) => {
  Artist.find({ _id: req.userData.id})
    .exec()
    .then(artist => {
      if (artist.length < 1) {
        return res.status(403).json({
          error: "Invalid Token"
        });
      }

      Artist.findOneAndUpdate({_id: req.userData.id},req.body,{new: true})
      .exec()
      .then(artist=>{
        return res.status(200).json({
          message: "Updated successfully",
          artist: artist
        });
      });
    });
}


exports.artist_wallet = (req,res,next) => {
  Artist.find({ _id: req.userData.id})
    .exec()
    .then(artist => {
      if (artist.length < 1) {
        return res.status(403).json({
          error: "Invalid Token"
        });
      }
      return res.status(200).json(artist[0]);
    });
}

//For testing purposes
exports.get_artists = (req, res, next) => {
  Artist.find()
    .select("phone username _id name bio artistImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        artists: docs.map(doc => {
          return {
            name: doc.name,
            username: doc.username,
            phone: doc.phone,
            bio: doc.bio,
            image: doc.artistImage,
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
