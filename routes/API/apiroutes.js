const Code = require("../../app/models/code")
const Entry = require("../../app/models/entry") 
module.exports = function(express, passport){
    router = express.Router();


    router.get("/data",(req,res,next)=>{
        console.log("Getting data...")
        console.log("parameters", req.query)
        res.json({status:200,"message":"Got request",datapoints:[


        ]})
    })
    router.post("/data",(req,res)=>{
        console.log(req.body,req.query.codeid)
        saveEntry(req.body,req.query.codeid)
        res.status(200).json({status:200,"message":"Got request",datapoints:[
            
        ]})
    })

    router.use(middle)


    function saveEntry(form,id){
        //check to make sure that the code exists
        return new Promise((resolve,reject)=>{
        Code.findOne({_id: id}).lean().exec(function(err,course){
            if(err || course==undefined || course==null){
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
            entry.ownerID = course._id || "N/A"
            entry.code = form.code || "N/A"
            entry.state = form.state || "N/A"
            entry.by = form.by || "N/A"
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