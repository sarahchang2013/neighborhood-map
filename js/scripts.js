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
	let map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 44.816667, lng: 20.466667},
		zoom: 13
	});

	const defaultIcon = makeMarkerIcon('0091ff');
	const highlightedIcon = makeMarkerIcon('ffff24');
	let markers = [];
	
	//Define the model of Location
	let Location = function(data, index) {
		this.name = ko.observable(data.name);
		this.location = data.location;
		//Decide if an item is displayed or not by input
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
			respondToClick(index);
		}
	}		

	//Knockout ViewModel
	let ViewModel = function() {
		let self = this;
		//markers[] must be populated before locationList
		//to make Location.showInfo work	
		//Create markers of all locations
		for (let i = 0; i < locations.length; i++) {
			let position = locations[i].location;
			let title = locations[i].name;
			let marker = new google.maps.Marker({
				position: position,
				title: title,
				animation: google.maps.Animation.DROP,
				icon: defaultIcon,
				id: i,
				address: ""
			});
			//Get the address by reverse geocoding from marker.position
			let geocoder = new google.maps.Geocoder;
			geocoder.geocode({'location': position}, function(results, status) {
				if (status === 'OK') {
      				if (results[0]) {
      					marker.address = results[0].formatted_address;
      				}
      			}
			});
			//Push markers to the array of markers
			markers.push(marker);
			//Respond to click
			markers[i].addListener('click', function() {
				respondToClick(i);
			});
		}
		let bounds = new google.maps.LatLngBounds();
		//Extend the boundaries of map for each marker
		for (let i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
				bounds.extend(markers[i].position);
		}
		//Display markers of all locations on map
		map.fitBounds(bounds);

		//Make the list an observable array
		//Bind with input by "textInput: searchText" to instantly update
		//("value: searchText" will only updates when user clicks the page)
		self.locationList = ko.observableArray([]);
		for (let i = 0; i < locations.length; i++) {
			self.locationList.push(new Location(locations[i], i));
		}
		//Change markers' visibility with input text
		searchText.subscribe(function() {
   			for (let i = 0; i < markers.length; i++) {
   				markers[i].setVisible(self.locationList()[i].display());
   			}
		});	
	}

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
	//Open an infoWindow when item or marker is clicked
	function populateInfoWindow(marker, infoWindow) {
		if (infoWindow.marker != marker) {
			infoWindow.marker = marker;
			infoWindow.setContent('<div>' + marker.title + '<br>' + marker.address + '</div>');
			infoWindow.open(map, marker);
			//infoWindow.addListener('çloseclick',function(){...}) doesn't work
			google.maps.event.addListener(infoWindow, 'closeclick', function() {
				infoWindow.setMarker = null;
				marker.setIcon(defaultIcon);
			});
		}
	}
	//When list item or marker is clicked, 
	//change marker color and open an infowindow
	function respondToClick(index) {
		let infoWindow = new google.maps.InfoWindow();
		//Center the map to marker's position
		map.setCenter(markers[index].position);
		markers[index].setIcon(highlightedIcon);
		populateInfoWindow(markers[index], infoWindow);
	}

	ko.applyBindings(new ViewModel());
}