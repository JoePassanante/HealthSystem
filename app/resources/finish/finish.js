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
const doc = doc.getElementById("doc")

//timing

//Admin Details
//document.querySelector('input[name="rate"]:checked').value;

const save = function(event){
    //check box details
let livingSelection = document.querySelector('input[name="living"]:checked').value;
let transfered = document.querySelector('input[name="tranfered"]:checked').value;
let family = document.querySelector('input[name="family"]:checked').value;
//final thing
let information = {
    //Patient Data
    Patient:{
        firstname: "",
        lastname :"",
        patientID :""
    },
    Medical:{
        documenter: "",
        others:[]
    },
    Timing:{},
    AdminDetails:{
        status: "",
        transfered: "",
        family:""
    }
}

console.log("Saving....")
$.ajax({
	type: 'POST',
	url: baseURL,
    dataType: 'json',
    data: information,
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
}

const inputRow = function(form){
	currID = currID + 1
	var table = $("#objects").append("<tr id = " + currID + "></tr>")
	var parent = table.find("#" + currID)
	parent.append("<th scope=\"row\">" + currID + "</th>");
	console.log("Append")
	parent.append("<td>" + (formatdate(new Date(form.date)) || "N/A") + "</td>"); //Data
	parent.append("<td>" + (form.state || "N/A") + "</td>"); // State
	parent.append("<td>" + (form.action || "N/A") + "</td>"); // Action Performed
	parent.append("<td>" + (form.author    || "N/A") + "</td>"); // Action Performed
	parent.append("<td>" + (form.notes || "N/A") + "</td>"); // Notes
}
const formatdate = function (date) {
	if (!(date instanceof Date)) {
		return null
	}
	return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours()) + ":" + date.getMinutes() + ":" + date.getSeconds()
}
window.onbeforeunload = function(){
    return 'Are you sure you want to leave?';
};