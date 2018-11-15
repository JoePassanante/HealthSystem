console.log("Getting current data...")
const urlParams = new URLSearchParams(window.location.search);
const codeID = urlParams.get('codeid');
console.log("myCode", codeID)
const baseURL = '/api/data/?codeid=' + codeID
let currID = 0
$("#finishcode").click((event) => {
	event.preventDefault();
	if (confirm("Are you sure you want to finish the code! \n\nYou will not be able to edit!")) {
		console.log("Done")
		window.location = "/finish/?codeid=" + codeID
	} else {
		console.log("Not done")
	}
})
var bus = new Vue();
//Do that vueeeee thangggg
Vue.component("specialbutton", {
	props: ["data"],
	template: `
	<button @click = "onClick"style="min-width: 70px;margin-left: 5px;margin-right: 5px;" id="arrest" type="button" class="btn btn-light btn-md">{{data.action}}</button>
	`,
	methods: {
		onClick() {
			console.log(this.data)
			let form = {
				"state": this.data.state || "N/A",
				"action": this.data.action || "N/A",
				"author": "N/A",
				"notes": this.data.notes || "N/A",
				"date": new Date()
			}
			$.ajax({
				type: 'POST',
				url: baseURL,
				dataType: 'json',
				data: form,
				success: function (data) {
					console.log("Telling")
					bus.$emit('update', 'thing')
				},
				error: function (data) {
				}
			});
		}
	}
})

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
	window.scrollTo(0, document.body.scrollHeight);
}
