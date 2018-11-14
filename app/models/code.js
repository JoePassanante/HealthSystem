// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    catagory: {type: String, required: false, default: ""},
    date: {type: Date, required: false, default: new Date()},
    enddate:{type: Date, required: false, default: null},
    //information
    patientid: {type: String, required: false, default: ""},
    firstname: {type: String, required: false, default: ""},
    lastname: {type: String, required: false, default: ""},

    //medical
    documenter: {type: String, required: false, default: ""},

    //admin
    patientstatus: {type: String, required: false, default: ""},
    transfered: {type: String, required: false, default: ""},
    family: {type: String, required: false, default: ""},

    //Locks
    codeActive: {type: Boolean, required: false, default: true},
    canEdit: {type: Boolean, required: false, default: true},
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Code', userSchema,"codes");