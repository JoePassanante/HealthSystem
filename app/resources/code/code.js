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
				currID = currID + 1
				var table = $("#objects").append("<tr id = " + currID + "></tr>")
				var parent = table.find("#" + currID)
				parent.append("<th scope=\"row\">" + currID + "</th>");
				var point = data.datapoints[index]
				console.log("Append")
				parent.append("<td>" + (formatdate(point.date) || "N/A") + "</td>"); //Data
				parent.append("<td>" + (point.code   || "N/A") + "</td>"); //Code
				parent.append("<td>" + (point.state  || "N/A") + "</td>"); // State
				parent.append("<td>" + (point.action || "N/A") + "</td>"); // Action Performed
				parent.append("<td>" + (point.author || "N/A") + "</td>"); // Completed By
				parent.append("<td>" + (point.notes  || "N/A") + "</td>"); // Notes
			}
			scroll()
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
		"code": c.val(),
		"state": s.val(),
		"action": a.val(),
		"by": b.val(),
		"notes": n.val(),
		"date": new Date()
	}
	newDatePoint(form)
}
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
					currID = currID + 1
					var table = $("#objects").append("<tr id = " + currID + "></tr>")
					var parent = table.find("#" + currID)
					parent.append("<th scope=\"row\">" + currID + "</th>");
					var point = data.datapoints[index]
					console.log("Append")
					parent.append("<td>" + (formatdate(form.date) || "N/A") + "</td>"); //Data
					parent.append("<td>" + (form.code  || "N/A") + "</td>"); //Code
					parent.append("<td>" + (form.state || "N/A") + "</td>"); // State
					parent.append("<td>" + (form.by    || "N/A") + "</td>"); // Action Performed
					parent.append("<td>" + (form.notes || "N/A") + "</td>"); // Notes
				}
				scroll()
			} else {
				throw "NO DATA POINTS"
			}
		},
		error: function (data) {
			console.log("Error")
		}
	});
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