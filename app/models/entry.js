// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    ownerID: {type: String, required: false, default: ""},
    code: {type: String, required: false, default: ""},
    state: {type: String, required: false, default: ""},
    by: {type: String, required: false, default: ""},
    notes: {type: String, required: false, default: ""},
    date: {type: Date, required: false, default: new Date()},
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Entry', userSchema,"Entries");