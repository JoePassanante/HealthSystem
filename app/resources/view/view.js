console.log("Dependency Added.")
console.log("Getting current data...")
const urlParams = new URLSearchParams(window.location.search);
const codeID = urlParams.get('codeid');
document.getElementById("codeID").innerText = "ID: " + codeID
console.log("myCode", codeID)
const baseURL = '/api/data/?codeid=' + codeID
let currID = 0

//All the input fields... ouch
//Patient
const pid = document.getElementById("id")
const pfn = document.getElementById("firstname")
const pln = document.getElementById("lastname")

//medical information
const doc = document.getElementById("doc")

//timing

//Admin Details
//document.querySelector('input[name="rate"]:checked').value;

const fill = function(){
    console.log("Filling....")
    
    $.ajax({
        type: 'GET',
        url: '/api/code/?codeid=' + codeID,
        dataType: 'json',
        success: function (data) {
            console.log("data",data)
            //we need to go through and cherry pick our code. 
            let datapoints = data.datapoints
            for(index in datapoints){
                let dp = datapoints[index]
                if(dp._id == codeID){
                    document.getElementById("patstatus").innerText = dp.patientstatus
                    document.getElementById("transfered").innerText = dp.transfered
                    document.getElementById("familynotified").innerText = dp.family

                    document.getElementById("startdate").innerText = formatdate((dp.date)) || "N/A"
                    document.getElementById("enddate").innerText = formatdate((dp.enddate)) || "N/A"
                    document.getElementById("totaltime").innerText = duration(dp.date,dp.enddate) || "N/A"


                    pid.value = dp.patientid
                    pfn.value = dp.firstname
                    pln.value = dp.lastname
                    doc.value = dp.documenter
                }
            }

        },
        error: function (data) {
            console.log("Error",data)
        }
    });
}

//attach to button
//exitcode
$("#printcode").click((event)=>{
	event.preventDefault();
    window.print();
})

//load code stuff
$.ajax({
    type: 'GET',
    url: baseURL,
    dataType: 'json',
    success: function (data) {
        console.log(data)
        if (data.hasOwnProperty("datapoints")) {
            //we have data. 
            if (data.datapoints.length == 0)
                return

            for (index in data.datapoints) {
                var point = data.datapoints[index]
                console.log("Append")
                inputRow(point)
            }
        } else {
            throw "NO DATA POINTS"
        }
    },
    error: function (data) {
        console.log("Error")
    }
});

const inputRow = function (form) {
    currID = currID + 1
    var table = $("#objects").append("<tr id = " + currID + "></tr>")
    var parent = table.find("#" + currID)
    parent.append("<th scope=\"row\">" + currID + "</th>");
    console.log("Append")
    parent.append("<td>" + (formatdate(new Date(form.date)) || "N/A") + "</td>"); //Data
    parent.append("<td>" + (form.state || "N/A") + "</td>"); // State
    parent.append("<td>" + (form.action || "N/A") + "</td>"); // Action Performed
    parent.append("<td>" + (form.author || "N/A") + "</td>"); // Action Performed
    parent.append("<td>" + (form.notes || "N/A") + "</td>"); // Notes
}
const formatdate = function (date) {
    if(date==null){
        return null
    }
    date = new Date(date)
    if (!(date instanceof Date)) {
        return null
    }
    return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours()) + ":" + date.getMinutes() + ":" + date.getSeconds()
}
const duration = function(date1,date2){
    try{    
        let a = new Date(date1)
        let b = new Date(date2)
        let x = b-a
        let seconds = Math.floor((x/1000)%60)
        let minutes = Math.floor(((x/(1000*60))%60))
        let hours = Math.floor(((x/(1000*60*60))%24))
        return hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds" 
    }catch(err){
        return null
    }
}
fill()