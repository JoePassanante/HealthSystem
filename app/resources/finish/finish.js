console.log("Dependency Added.")
console.log("Getting current data...")
const urlParams = new URLSearchParams(window.location.search);
const codeID = urlParams.get('codeid');
console.log("myCode", codeID)
const baseURL = '/api/data/?codeid=' + codeID
let currID = 0
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

const save = function (event) {
    //check box details
    let livingSelection = document.querySelector('input[name="living"]:checked').value || "NDF";
    let transfered = document.querySelector('input[name="transfered"]:checked').value || "NDF";
    let family = document.querySelector('input[name="family"]:checked').value || "NDF";
    //final thing
    let information = {
        //Patient Data
        Patient: {
            firstname: pfn.value,
            lastname: pln.value,
            patientID: pid.value
        },
        Medical: {
            documenter: doc.value,
            others: []
        },
        Timing: {},
        AdminDetails: {
            status: livingSelection,
            transfered: transfered,
            family: family
        }
    }

    console.log("Saving....")
    console.log(information)
    $.ajax({
        type: 'POST',
        url: '/api/code/?codeid=' + codeID,
        dataType: 'json',
        data: information,
        success: function (data) {
            console.log(data)
            window.location = "/"
        },
        error: function (data) {
            console.log("Error",data)
        }
    });
}

//attach to button
//exitcode
$("#exitcode").click((event)=>{
	event.preventDefault();
	if (confirm("Are you sure you want to save and exit the code! \n\nYou will not be able to edit again!")) {
        console.log("Done")
        save()
		window.location = "/finish/?codeid="+codeID
    } else {
        console.log("Not done")
    }
})


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
    parent.append('<td><button class="btn btn-secondary data-toggle="modal" data-target="#exampleModalCenter">Edit</button>'+"</td>"); // Notes

}
const formatdate = function (date) {
    if (!(date instanceof Date)) {
        return null
    }
    return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours()) + ":" + date.getMinutes() + ":" + date.getSeconds()
}
window.onbeforeunload = function () {
    return 'Are you sure you want to leave?';
};