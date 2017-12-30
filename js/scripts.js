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

//searchText needs to be global,
//1.to be accessible for initMap when initially loaded,
//2.to be accessible for ViewModel to work afterwards.
let searchText = ko.observable("");

//Initialize the map when Google API is loaded
//All google.xx calls should be put here
//to avoid "undefined google" errors
function initMap() {	
	// Constructor creates a new map - only center and zoom are required.
	const map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 44.816667, lng: 20.466667},
		zoom: 13
	});

	const defaultIcon = makeMarkerIcon('0091ff');
	const highlightedIcon = makeMarkerIcon('ffff24');
	let markers = [];
	
	//Make marker icons and color them
	function makeMarkerIcon(markerColor) {
		let markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
			 '|40|_|%E2%80%A2',
			new google.maps.Size(21, 34),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34),
			new google.maps.Size(21,34));
		return markerImage;
	}
	
	//Define the model of Location
	let Location = function(data, index) {
		this.name = ko.observable(data.name);
		this.location = data.location;
		this.display = ko.computed(function() {
			//Observables must be followed with () to update
			if (searchText() == "") {
				return true;
			} else {
				//Convert to lowercases to find matching substrings.
				return this.name().toLowerCase().includes(searchText().toLowerCase());
			}
		}, this);
		this.showInfo = function() {
			markers[index].setIcon(highlightedIcon);
		}
	}		

	//Knockout ViewModel
	let ViewModel = function() {
		let self = this;
		
		//Bind with input by "textInput: searchText" to instantly update,
		//"value: searchText" will only updates when user clicks the page.
		self.locationList = ko.observableArray([]);
		for (let i = 0; i < locations.length; i++) {
			self.locationList.push(new Location(locations[i], i));
		}
		
		//Create markers of all locations
		for (let i = 0; i < locations.length; i++) {
			let position = locations[i].location;
			let title = locations[i].name;
			let marker = new google.maps.Marker({
				position: position,
				title: title,
				animation: google.maps.Animation.DROP,
				icon: defaultIcon,
				id: i
			});
			//For unknown reasons, marker.addListener doesn't work here.
			google.maps.event.addListener(marker, 'click', function() {
  				marker.setIcon(highlightedIcon);
				//populateInfoWindow(this, infoWindow);
			});
			//Push markers to the array of markers
			markers.push(marker);
		}
		let bounds = new google.maps.LatLngBounds();
		//Extend the boundaries of map for each marker
		for (let i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
				bounds.extend(markers[i].position);
		}
		//Display markers of all locations on map
		map.fitBounds(bounds);

		//Change markers' visibility with input text
		searchText.subscribe(function() {
   			for (let i = 0; i < markers.length; i++) {
   				markers[i].setVisible(self.locationList()[i].display());
   			}
		});	
	}
	ko.applyBindings(new ViewModel());
}