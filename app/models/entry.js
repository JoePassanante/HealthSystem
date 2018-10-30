// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, default:"", required: true},
    firstname: {type: String, default:""},
    lastname: {type: String, default:""},
    date: {type: Date, required: false, default: new Date()},
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, bcrypt.genSaltSync(8), null, function(err, hash) {
            if(err){
                reject(null)
            }else{
                resolve(hash)
            }
        });
    })
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return new Promise((resolve, reject)=>{
        bcrypt.compare(password, this.password, function(err, res) {
            if(err || res==false){
                reject(false)
            }
            resolve(true)
        });
    })
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema,"users");