const Code = require("../../app/models/code")
const Entry = require("../../app/models/entry")
const Quick = require("../../app/models/quick")

module.exports = function (express, passport) {
    router = express.Router();

    //Button Stuff
    router.get("/quicks", (req, res, next) => {
        Quick.find().exec(function (err, quicks) {
            if(err || quicks.length == 0 || quicks == undefined || quicks == null){
                return res.status(200).json({ "message": "Here we go!", datapoints: [] })
            }
            console.log(quicks)
            return res.status(200).json({ "message": "Here we go!", datapoints: quicks})
        })
    })
    router.post("/quick",(req,res,next)=>{
        let data = req.body
        console.log("data",data)
        if(!data.hasOwnProperty("action") || !data.hasOwnProperty("notes") || !data.hasOwnProperty("state")){
            console.log("Missing")
            return res.status(500).send("")
        }
        console.log("Processing...")
        let quick = new Quick()
        quick.action = data.action;
        quick.notes = data.notes;
        quick.state = data.state;
        quick.save(function(err){
            if(err){
                console.log("error")
            }
            console.log("Done")
            res.status(200).json({"status":200})
        })
    })
    router.delete("/quick",(req,res,next)=>{
        if(!req.body.hasOwnProperty("id")){
            return res.status(500).json({"message":"Nope."})
        }
        Quick.remove({_id: req.body.id }).exec(function (err) {
            if(err){
                return res.status(500).json({"message":"Nope."})
            }
            console.log("Done")
            res.status(200).json({"status":200})
        })
    })




    //pending
    router.get("/pendingcodes", (req, res, next) => {
        console.log("Getting data...")
        //Get the data from the database. 
        Code.find({ canEdit: true }).lean().exec(function (err, codes) {
            if (err || codes == undefined || codes == null) {
                return res.status(406).json({ "message": "No course found", datapoints: [] })
            }
            return res.status(200).json({ "message": "Here we go!", datapoints: codes })

        })
    })
    router.get("/codes", (req, res, next) => {
        console.log("Getting data...")
        //Get the data from the database. 
        Code.find({ canEdit: false }).lean().exec(function (err, codes) {
            if (err || codes == undefined || codes == null) {
                return res.status(406).json({ "message": "No course found", datapoints: [] })
            }
            return res.status(200).json({ "message": "Here we go!", datapoints: codes })

        })
    })
    router.get("/code", (req, res, next) => {
        console.log("Getting data...", req.query)
        //Get the data from the database. 
        Code.findOne({ _id: req.query.codeid }).lean().exec(function (err, code) {
            if (err || code == undefined || code == null) {
                return res.status(406).json({ "message": "No course found", datapoints: [] })
            }
            return res.status(200).json({ "message": "Here we go!", datapoints: [code] })

        })
    })

    router.get("/data", (req, res, next) => {
        console.log("Getting data...")
        console.log("parameters", req.query)
        //Get the data from the database. 
        Code.findOne({ _id: req.query.codeid }).lean().exec(function (err, code) {
            if (err || code == undefined || code == null) {
                return res.status(406).json({ "message": "No course found", datapoints: [] })
            }
            Entry.find({ ownerID: code._id }).lean().exec((err, entries) => {
                console.log(entries)
                if (err) {
                    return res.status(406).json({ "message": "No data", datapoints: [] })
                }
                return res.status(200).json({ "message": "Data Found", datapoints: entries })
            })
        })
    })
    router.post("/data", (req, res) => {
        console.log("GOT IT")
        console.log(req.body, req.query.codeid)
        saveEntry(req.body, req.query.codeid)
            .then((data) => {
                console.log(data)
                res.status(200).json({
                    status: 200, "message": "Got request", datapoints: [
                        data
                    ]
                })
            })
    })

    router.post("/code", (req, res, next) => {
        console.log("Getting data...")
        console.log("parameters", req.query)
        console.log("Body", req.body)
        //get the code
        let data = req.body
        Code.findOne({ _id: req.query.codeid }).exec(function (err, code) {
            if (err || code == undefined || code == null) {
                return res.status(500).send("Not code found")
            }
            if (code.canEdit == false) {
                return res.status(403).send("Locked Code")
            }
            code.canEdit = false // lock code from future edits
            code.patientid = data.Patient.patientID || "N/A"
            code.firstname = data.Patient.firstname || "N/A"
            code.lastname = data.Patient.lastname || "N/A"

            code.documenter = data.Medical.documenter || "N/A"

            code.patientstatus = data.AdminDetails.status
            code.transfered = data.AdminDetails.transfered
            code.family = data.AdminDetails.family

            code.enddate = new Date()

            code.save(function (err) {
                console.log("Saved")
                res.status(206).send("Code Good")
            })

        })
    })

    router.use(middle)


    function saveEntry(form, id) {
        //check to make sure that the code exists
        return new Promise((resolve, reject) => {
            Code.findOne({ _id: id }).lean().exec(function (err, code) {
                if (err || code == undefined || code == null) {
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

                entry.save(function (err) {
                    if (err) {
                        console.log("Error saving entry")
                        return reject(null)
                    }
                    resolve(entry)
                })
            })
        })
    }


    // router.use("/)
    function middle(req, res, next) {
        console.log("API request incoming...")
        next()
    }
    return router;
}