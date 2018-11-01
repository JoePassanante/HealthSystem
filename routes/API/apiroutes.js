const Code = require("../../app/models/code")
const Entry = require("../../app/models/entry") 
module.exports = function(express, passport){
    router = express.Router();


    router.get("/data",(req,res,next)=>{
        console.log("Getting data...")
        console.log("parameters", req.query)
        //Get the data from the database. 
        Code.findOne({_id: req.query.codeid}).lean().exec(function(err,code){
            if(err || code==undefined || code==null){
                return res.status(406).json({"message":"No course found",datapoints:[]})
            }
            Entry.find({ownerID: code._id}).lean().exec((err,entries)=>{
                console.log(entries)
                if(err){
                    return res.status(406).json({"message":"No data",datapoints:[]})
                }
                return res.status(200).json({"message":"Data Found",datapoints:entries})
            })
        })
    })
    router.post("/data",(req,res)=>{
        console.log(req.body,req.query.codeid)
        saveEntry(req.body,req.query.codeid)
        .then((data)=>{
            console.log(data)
            res.status(200).json({status:200,"message":"Got request",datapoints:[
                data
            ]})
        })
    })

    router.use(middle)


    function saveEntry(form,id){
        //check to make sure that the code exists
        return new Promise((resolve,reject)=>{
        Code.findOne({_id: id}).lean().exec(function(err,code){
            if(err || code==undefined || code==null){
                return reject(null)
            }
            /*
    ownerID: {type: String, required: false, default: ""},
    code: {type: String, required: false, default: ""},
    state: {type: String, required: false, default: ""},
    by: {type: String, required: false, default: ""},
    notes: {type: String, required: false, default: ""},
    date: {type: Date, required: false, default: new Date()},

            */
            //we know the code exists
            let entry = new Entry()
            entry.ownerID = code._id || "N/A"
            entry.action = form.action || "N/A"
            entry.state = form.state || "N/A"
            entry.author = form.author || "N/A"
            entry.notes = form.notes || "N/A"
            entry.date = form.date || "N/A"

            entry.save(function(err){
                if(err){
                    console.log("Error saving entry")
                    return reject(null)
                }
                resolve(entry)
            })
        })
        })
    }


    // router.use("/)
    function middle(req,res,next){
        console.log("API request incoming...")
        next()
    }
    return router;
}