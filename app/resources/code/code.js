console.log("Getting current data...")
const urlParams = new URLSearchParams(window.location.search);
const codeID = urlParams.get('codeid');
console.log("myCode", codeID)
const baseURL = '/api/data/?codeid=' + codeID
let currID = 0

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
$("#finishcode").click((event) => {
	event.preventDefault();
	if (confirm("Are you sure you want to finish the code! \n\nYou will not be able to edit!")) {
		console.log("Done")
		window.location = "/finish/?codeid=" + codeID
	} else {
		console.log("Not done")
	}
})

//Do that vueeeee thangggg
Vue.component('entryrow', {
	// camelCase in JavaScript
	props: {
		entry: {
			type: Object,
			default: {
				index: "N/A",
			}
		}
	},
	template: `
	<tr scope="row">
	<th>{{entry.index}}</th>
	<!--Date  -->
	<td>{{entry.format}}</td>
	<!-- State -->
	<td>{{entry.action}}</td>
	<!-- Action -->
	<td>{{entry.state}}</td>
	<!-- Completed -->
	<td>{{entry.author}}</td>
	<!-- Notes -->
	<td>{{entry.notes}}</td>
</tr>
	`,
	methods: {

	},
	mounted() {
		console.log("Here.")
	}
})
// Yo fuck me right?????
var app = new Vue({
	el: '#letsjustfuckingdoit',
	data: {
		entries: []
	},
	mounted() {
		$("#submitbutton").click(this.handleSubmit)
		this.refresh()
	},
	methods: {
		refresh(){
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
						})
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
				})

			})
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
					c.value = ""
					// s.val() = ""
					// a.val() = ""
					// b.val() = ""
					// n.val() = ""
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
	window.scrollTo(0, document.body.scrollHeight);
}
