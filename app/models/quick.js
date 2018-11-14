// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    notes: {type: String, required: false, default: ""},
    action: {type: String, required: false, default: ""},
    state: {type: String, required: false, default: ""},
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Quick', userSchema,"Quicks");