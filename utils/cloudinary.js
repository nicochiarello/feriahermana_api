const cloudinary = require('cloudinary')

cloudinary.v2.config({
  cloud_name: "doicfmcin",
  api_key: "628595551931224",
  api_secret: "sE0fTe27BqfNis5cbwVJMoXaNIg",
});

module.exports = cloudinary;
