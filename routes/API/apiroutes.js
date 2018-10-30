
module.exports = function(express, passport){
    router = express.Router();


    router.get("/data",(req,res,next)=>{
        console.log("Getting data...")
        console.log("parameters", req.query)
        res.json({status:200,"message":"Got request",datapoints:[


        ]})
    })
    router.post("/data",(req,res)=>{
        console.log(req.body)
        res.status(200).json({status:200,"message":"Got request",datapoints:[

        ]})
    })

    router.use(middle)


    function saveEntry(form){
        return new Promise((resolve,reject)=>{


            
        })
    }


    // router.use("/)
    function middle(req,res,next){
        console.log("API request incoming...")
        next()
    }
    return router;
}