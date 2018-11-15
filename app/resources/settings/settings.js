console.log("Depend added")
const codes = document.getElementById("done")
//parent.append("<td>" + (formatdate(new Date(form.date)) || "N/A") + "</td>"); //Data
const baseURL = '/api/quick'
console.log("Getting data...")

// Vue Stuff
Vue.component('buttoncard', {
	// camelCase in JavaScript
	props: ['c','refresh'],
	template: `
	<a class="card pendingcode">
	<div class="card-body">
		<p><b>Action: </b>{{c.action}}</p>
		<p><b>State: </b>{{c.state}}</p>
		<p><b>Notes: </b>{{c.notes}}</p>
		<!-- <button @click="getClickEdit" type="button" class="btn btn-info">Edit Action</button> -->
		<button @click="getClickRemove" type="button" class="btn btn-danger">Remove</button>
		</div>
	</a>
	
	`,
	methods: {
		getClickEdit() {
			console.log("Clicked")
		},
		getClickRemove() {
			let vue = this;
			if(confirm('Are you sure you want to remove this action?')){
				$.ajax({
					type: 'DELETE',
					url: '/api/quick',
					dataType: 'json',
					data: {id:vue.c._id},
					success: function (data) {
						vue.refresh()
					},
					error: function (data) {
						console.log("Error")
					}
				});
			}else{
				console.log("Forget.")
			}
		},
		removeButton(){
			
		}
	}
})

var app = new Vue({
	el: '#custbuttons',
	data: {
		customs: [
		]
	},
	mounted() {
		this.buttonRefresh()
		this.saveNewButton()
	},
	methods: {
		buttonRefresh() {
			let vue = this;
			$.ajax({
				type: 'GET',
				url: '/api/quicks',
				dataType: 'json',
				success: function (data) {
					console.log(data)
					if (data.hasOwnProperty("datapoints")) {
						vue.customs = data.datapoints
					} else {
						throw "NO DATA POINTS"
					}
				},
				error: function (data) {
					console.log("Error")
				}
			});
		},
		saveNewButton(){
			let vue = this;
			document.getElementById("savenewbutton").onclick = function(){
				console.log("Saving...")
				document.getElementById("savenewbutton").innerText = "Saving..."
				document.getElementById("savenewbutton").disabled = true;
				// $('#newbutton').modal('hide')
				// Get the data we need to send
				let tempaction = document.getElementById("newaction")
				let tempstatus = document.getElementById("newstate")
				let tempnotes = document.getElementById("newnotes")
				let form = {
					"action": tempaction.value || "N/A",
					"state":  tempstatus.value || "N/A",
					"notes": tempnotes.value || "N/A"
				}
				console.log("f",form)
				$.ajax({
					type: 'POST',
					url: '/api/quick',
					dataType: 'json',
					data: form,
					success: function (data) {
						vue.buttonRefresh()
						console.log("Saved...")
						console.log("Done 1")
						tempaction.value = ""
						tempstatus.value = ""
						tempnotes.value = ""
						console.log("Done 2")

						document.getElementById("savenewbutton").innerText = "Save"
						document.getElementById("savenewbutton").disabled = false;
						console.log("Done 3")
						$('#newbutton').modal('hide')

						console.log("Done.")
					}
				});
			}
		}
	},
})