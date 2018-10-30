// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    catagory: {type: String, required: false, default: ""},
    date: {type: Date, required: false, default: new Date()},
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Code', userSchema,"codes");