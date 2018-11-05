// app/routes.js
const path = require("path")
const configcodes = require("../../config/codes")
const Code = require("../../app/models/code")
const Entry = require("../../app/models/entry") 
module.exports = function (express, passport) {
    router = express.Router();
    // HOME PAGE
    router.get("/", (req, res, next) => { 

        let file = path.join(__dirname, "..", "..", "app", "resources", "index.html") 
        console.log(file)

        res.sendFile(file)
    })


    router.get("/startcode/:id",(req,res,next)=>{
        console.log("Current Code",req.params)
        //check to make sure the code exists
        for(index in configcodes.codes){
            let code = configcodes.codes[index]
            console.log("Found code",code.name)
            if(code.name.trim().toLowerCase()==req.params.id.trim().toLowerCase()){
                return startCode(req,res,next)
            }
        }
        res.status(403).send("Code Does not exist.")
    })

    router.get("/code",(req,res,next)=>{
        let file = path.join(__dirname, "..", "..", "app", "resources","code", "code.html") //__dirname is a constant that is established, automatically provides the path to the current folder <THIS> Js file is in. 
        console.log(req.query)
        //we need to check to make sure that the user is allowed to join the code. 
        if(!req.query.hasOwnProperty("codeid")){
            return res.redirect("/")
        }
        Code.findOne({_id: req.query.codeid}).lean().exec(function(err,code){
            if(err || code==undefined || code==null){
                return res.redirect("/")
            }
            if(code.canEdit==false){
                return res.redirect("/")
            }
            return res.sendFile(file)
        })
    })
    router.get("/finish",(req,res,next)=>{
        let file = path.join(__dirname, "..", "..", "app", "resources","finish", "finish.html") //__dirname is a constant that is established, automatically provides the path to the current folder <THIS> Js file is in. 
        console.log(req.query)
        //check to see if they can access this page
        Code.findOne({_id: req.query.codeid}).lean().exec(function(err,code){
            if(err || code==undefined || code==null){
                return res.redirect("/")
            }
            if(code.canEdit==false){
                return res.redirect("/")
            }
            return res.sendFile(file)
        })
    })
    router.get("/view",(req,res,next)=>{
        let file = path.join(__dirname, "..", "..", "app", "resources","view", "view.html") //__dirname is a constant that is established, automatically provides the path to the current folder <THIS> Js file is in. 
        console.log(req.query)
        //check to see if they can access this page
        Code.findOne({_id: req.query.codeid}).lean().exec(function(err,code){
            if(err || code==undefined || code==null){
                return res.redirect("/")
            }
            return res.sendFile(file)
        })
    })

    const startCode = function(req,res,next){
        let code = new Code()
        code.catagory = req.params.id.trim().toLowerCase()
        code.date = new Date();
        code.save(function(err){
            if(err){
                return res.status(500).send("ahh.. there was an error.")
            }
            res.redirect("/code/?codeid="+code._id)
        })
    }
    const finishCode = function(req,res,next){

    }

    return router;
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
