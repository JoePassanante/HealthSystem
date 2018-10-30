// app/routes.js
const path = require("path")


module.exports = function(app, passport,express) {
    const apiroutes = require('./API/apiroutes')(express,passport)
    const pages = require("./Pages/routes")(express,passport)
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use("/api",apiroutes)
    app.get("*",pages)
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
