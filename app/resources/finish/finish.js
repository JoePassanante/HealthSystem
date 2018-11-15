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
	
	let all =  Array.from(document.getElementsByClassName("staffmember"))
	let list = []
	all.forEach(function(element){
		console.log(element.value)
		list.push(element.value)
	})

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
            others: list
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
$("#addanother").click((event)=>{
	$("#people").append(
		`
		<div class="form-group">
		<label for="exampleInputPassword1">Medical Staff</label>
		<input type="text" class="form-control staffmember" id="med" placeholder="n/a">
	</div>
		`

	)
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
//Here we go... DRAG AND DROP!!!
var bus = new Vue();
var app = new Vue({
	el: '#work',
	data: {
		entries: [],
		buttons: []
	},
	mounted() {
		$("#submitbutton").click(this.handleSubmit)
		this.refresh()
		console.log("Refreshing...")
		this.buttonRefresh()
	},
	created() {
		bus.$on('update', (text) => {
			this.refresh()
		})
	},
	methods: {
		refresh() {
			let vue = this;
			console.log("mounted")
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
						var index = 1
						data.datapoints.forEach(function (entry) { entry.format = formatdate(new Date(entry.date)); entry.index = index; index = index + 1 });

						console.log(data.datapoints)
						vue.entries = data.datapoints
						vue.$nextTick(() => {
							vue.attachListners()
							scroll()
						})
					}
				},
				error: function (data) {
					console.log("Error")
				}
			});
		},
		buttonRefresh() {
			let vue = this;
			$.ajax({
				type: 'GET',
				url: '/api/quicks',
				dataType: 'json',
				success: function (data) {
					console.log(data)
					if (data.hasOwnProperty("datapoints")) {
						vue.buttons = data.datapoints
					} else {
						throw "NO DATA POINTS"
					}
				},
				error: function (data) {
					console.log("Error")
				}
			});
		},
		attachListners() {
			let vue = this;
			console.log(document.getElementsByClassName("needslistener"))
			let docs = Array.from(document.getElementsByClassName("needslistener"))
			console.log(docs)
			docs.forEach((element) => {
				console.log("Fuck")
				element.removeEventListener("focusout", null);
				element.addEventListener("focusout", () => {
					console.log(element.getAttribute("name"))
					vue.saveEntry(element.getAttribute("name"), element.getAttribute("box"), element.innerHTML)
				})

			})
		},
		saveEntry(id, box, input) {
			// LETS FUCKING DO IT AGAIN BECAUSE FUCK ME...
			console.log("Got", id, input, box)
			$.ajax({
				type: 'PUT',
				url: '/api/entry',
				dataType: 'json',
				data: { id: id, change: box, data: input },
				success: function (data) {

				},
				error: function (data) {
					console.log("Error")
				}
			});
		},
		handleSubmit() {
			let vue = this;
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
			$.ajax({
				type: 'POST',
				url: baseURL,
				dataType: 'json',
				data: form,
				success: function (data) {
					console.log(data)
					c.val(null)
					s.val(null)
					a.val(null)
					b.val(null)
					n.val(null)
					vue.refresh()
				},
				error: function (data) {
					console.log("Error")
				}
			});
		}
	}
})
const formatdate = function (date) {
	if (!(date instanceof Date)) {
		return null
	}
	return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + (date.getHours()) + ":" + date.getMinutes() + ":" + date.getSeconds()
}
const scroll = function () {
	// window.scrollTo(0, document.body.scrollHeight);
}