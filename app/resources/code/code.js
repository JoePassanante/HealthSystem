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
//handle click events
const submitForm = function (event) {
	console.log("Submitting Form")
	const c = $("#code")
	const s = $("#state")
	const a = $("#action")
	const b = $("#by")
	const n = $("#notes")
	let form = {
		"state": s.val(),
		"action": a.val(),
		"author": b.val(),
		"notes": n.val(),
		"date": new Date()
	}
	newDatePoint(form)
	c.val() = ""
	s.val() = ""
	a.val() = ""
	b.val() = ""
	n.val() = ""
}
$("#finishcode").click((event)=>{
	event.preventDefault();
	if (confirm("Are you sure you want to finish the code! \n\nYou will not be able to edit!")) {
		console.log("Done")
		window.location = "/finish/?codeid="+codeID
    } else {
        console.log("Not done")
    }
})
$("#submitbutton").click(submitForm)
const newDatePoint = function (form) {
	$.ajax({
		type: 'POST',
		url: baseURL,
		dataType: 'json',
		data: form,
		success: function (data) {
			console.log(data)
			if (data.hasOwnProperty("datapoints")) {
				//we have data. 
				if (data.datapoints.length == 0)
					return

				for (index in data.datapoints) {
					inputRow(form)
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
	parent.append("<td contenteditable>" + (form.state || "N/A") + "</td>"); // State
	parent.append("<td contenteditable>" + (form.action || "N/A") + "</td>"); // Action Performed
	parent.append("<td contenteditable>" + (form.author    || "N/A") + "</td>"); // Action Performed
	parent.append("<td contenteditable>" + (form.notes || "N/A") + "</td>"); // Notes
	scroll()
}
const formatdate = function (date) {
	if (!(date instanceof Date)) {
		return null
	}
	return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours()) + ":" + date.getMinutes() + ":" + date.getSeconds()
}
const scroll = function () {
	window.scrollTo(0, document.body.scrollHeight);
}