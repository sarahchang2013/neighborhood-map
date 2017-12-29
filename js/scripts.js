let markers = [];
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	let map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 44.816667, lng: 20.466667},
		zoom: 13
    });
}

//Locations, can be stored in a database and read from it
//Additional functions to add places can be achieved with Places API
const locations = [
	{
		name: "National Library of Serbia",
		location: {lat: 44.797666, lng: 20.467423}
	},
	{
		name: "Church of Saint Sava",
		location: {lat: 44.798309, lng: 20.469086}
	},
	{
		name: "Old Palace",
		location: {lat: 44.811105, lng: 20.462534}
	},
	{
		name: "Belgrade City Library",
		location: {lat: 44.820358, lng: 20.453665}
	},
	{
		name: "Kalemegdan Park",
		location: {lat: 44.822479, lng: 20.450888}
	}
]

//const defaultIcon = makeMarkerIcon('0091ff');

//Bind with input by "textInput: searchText" to instantly update,
//"value: searchText" will only updates when user clicks the page.
let searchText = ko.observable("");

let Location = function(data) {
	this.name = ko.observable(data.name);
	this.location = data.location;
	this.displayName = ko.computed(function() {
		//Observables must be followed with () to update
		if (searchText() == "") {
			return true;
		} else {
			//Convert to lowercases to find matching substrings.
			return this.name().toLowerCase().includes(searchText().toLowerCase());
		}
	}, this);
}

for (let i = 0; i < locations.length; i++) {
	var position = locations[i].location;
}

let ViewModel = function() {
	let self = this;
	self.locationList = ko.observableArray([]);
	for (let i = 0; i < locations.length; i++) {
		self.locationList.push(new Location(locations[i]));
	}
}

ko.applyBindings(new ViewModel());