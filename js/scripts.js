var map;
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 44.816667, lng: 20.466667},
		zoom: 13
    });
}

locations = [
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

var Location = function(data) {
	this.name = ko.observable(data.name);
}

var ViewModel = function() {
	var self = this;
	self.locationList = ko.observableArray([]);
	for (var i=0; i<locations.length; i++) {
		self.locationList.push(new Location(locations[i]));
	}
}

ko.applyBindings(new ViewModel());