const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const albumRoutes = require("./api/routes/album");
const songRoutes = require("./api/routes/song");
const artistRoutes = require("./api/routes/artist");
const userRoutes = require("./api/routes/user");

mongoose.connect(
"mongodb+srv://node-shop:node-shop@xstreammusicapp-jwyek.mongodb.net/test?retryWrites=true&w=majority"
);


// mongoose.connect("mongodb://localhost/xStream",
//   {
//     useNewUrlParser: true
//   });

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/album", albumRoutes);
app.use("/song", songRoutes);
app.use("/artist", artistRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
