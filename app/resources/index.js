console.log("Depend added")
const codes = document.getElementById("done")
const pending = document.getElementById("pending")
//parent.append("<td>" + (formatdate(new Date(form.date)) || "N/A") + "</td>"); //Data
const baseURL = '/api/codes'
console.log("Getting data...")
// Vuueeeee 
Vue.component('codecheck', {
	// camelCase in JavaScript
	props: ['go','code','name'],
	template: `
	<a class="card pendingcode">
	<div class="card-body">
		<h4>Patient: {{code.firstname}} {{code.lastname}}</h4>
		<h5>ID: {{code.patientid}}</h5>
		<h4>Documenter: {{code.documenter}}</h4>
		<p>Date: {{code.format}}</p>
		<!-- <a v-bind:href="'/view/?codeid='+ code._id" class="btn btn-info">View</a> -->
		<button @click="getClick" v-bind:href="'/view/?codeid='+ code._id" type="button" class="btn btn-info">{{name}}</button>
		<p class="text-muted" style="font-size: 12px;">UID: {{code._id}}</p>

		</div>
	</a>
	
	`,
	methods:{
		getClick(){
			console.log(this.code._id,this.go)
			window.location.href = this.go+"/?codeid="+this.code._id;
		}
	}
  })

var app = new Vue({
	el: '#loadcodes',
	data: {
		codes: [
		]
	},
	mounted() {
		let vue = this;
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
					data.datapoints.forEach(function(code) { code.format = formatdate(code.date); });
					data.datapoints.sort(function(a, b){return new Date(b.date) - new Date(a.date)});
					vue.codes = data.datapoints
				} else {
					throw "NO DATA POINTS"
				}
			},
			error: function (data) {
				console.log("Error")
			}
		});
	}
})
var pendingapp = new Vue({
	el: '#loadpending',
	data: {
		codes: [
		]
	},
	mounted() {
		let vue = this;
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
					data.datapoints.forEach(function(code) { code.format = formatdate(code.date); });
					data.datapoints.sort(function(a, b){return new Date(b.date) - new Date(a.date)});
					vue.codes = data.datapoints
				} else {
					throw "NO DATA POINTS"
				}
			},
			error: function (data) {
				console.log("Error")
			}
		});
	}
})
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