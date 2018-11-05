console.log("Depend added")
const codes = document.getElementById("done")
//parent.append("<td>" + (formatdate(new Date(form.date)) || "N/A") + "</td>"); //Data
const baseURL = '/api/codes'
console.log("Getting data...")
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

		} else {
			throw "NO DATA POINTS"
		}
	},
	error: function (data) {
		console.log("Error")
	}
});