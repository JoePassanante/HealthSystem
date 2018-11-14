console.log("Depend added")
const codes = document.getElementById("done")
const pending = document.getElementById("pending")
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
            for(index in data.datapoints){
                let dp = data.datapoints[index]
                let id = dp._id
				console.log(id)
				var li = document.createElement("li");
				var container = document.createElement("div");
				li.classList.add('codeholder');

				container.classList.add('pendingcode');
                var node = document.createElement("a");
                var textnode = document.createTextNode(dp.firstname + " " + dp.lastname+  " | "+ dp._id + " | " + dp.catagory + " | " + dp.date);
                node.appendChild(textnode);
				node.setAttribute("href","http://localhost:8080/view/?codeid="+id)
				container.appendChild(node)
				li.appendChild(container)
                document.getElementById("done").appendChild(li);
            }
            // codes.append("<a href='http://localhost:8080/view/?codeid=>" +  + "</td>"); //Data

		} else {
			throw "NO DATA POINTS"
		}
	},
	error: function (data) {
		console.log("Error")
	}
});
$.ajax({
	type: 'GET',
	url: '/api/pendingcodes',
	dataType: 'json',
	success: function (data) {
		console.log(data)
		if (data.hasOwnProperty("datapoints")) {
			//we have data. 
			if (data.datapoints.length == 0)
                return
            for(index in data.datapoints){
                let dp = data.datapoints[index]
                let id = dp._id
				console.log(id)
				var li = document.createElement("li");
				var container = document.createElement("div");
				li.classList.add('codeholder');

				container.classList.add('pendingcode');
                var node = document.createElement("a");
                var textnode = document.createTextNode(dp.firstname + " " + dp.lastname+  " | "+ dp._id + " | " + dp.catagory + " | " + dp.date);
                node.appendChild(textnode);
				node.setAttribute("href","http://localhost:8080/code/?codeid="+id)
				container.appendChild(node)
				li.appendChild(container)
                document.getElementById("pending").appendChild(li);
            }
            // codes.append("<a href='http://localhost:8080/view/?codeid=>" +  + "</td>"); //Data

		} else {
			throw "NO DATA POINTS"
		}
	},
	error: function (data) {
		console.log("Error")
	}
});