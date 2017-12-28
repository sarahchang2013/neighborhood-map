var map;
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 44.816667, lng: 20.466667},
		zoom: 13
    });
}

var locations = [
	{
		name: "National Library of Serbia"
	},
	{
		name: "Church of Saint Sava"
	},
	{
		name: "Old Palace"
	},
	{
		name: "Belgrade City Library"
	},
	{
		name: "Kalemegdan Park"
	}
]

//Bind with input by "textInput: searchText" to instantly update,
//"value: searchText" will only updates when user clicks the page.
var searchText = ko.observable(""); 

var Location = function(data) {
	this.name = ko.observable(data.name);
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

var ViewModel = function() {
	var self = this;
	self.locationList = ko.observableArray([]);
	for (var i=0; i<locations.length; i++) {
		self.locationList.push(new Location(locations[i]));
	}
}

ko.applyBindings(new ViewModel());