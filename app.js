// Helper for decentralized development
////////////////////////////////////////////////////
var onSpot = false;
// var onSpot = true;

var Storage = Storage || {};

var MapObject = MapObject || {};

var JSONHelper = JSONHelper || {};
// Global Variables
//////////////////////
var bounds;
var map;
var infoWindow;
var position;
var restaurants = [];
var geocoder;

var request = JSONHelper.createRequest(position);

function initialize() {
    ////////// Geolocation
    geocoder = new window.google.maps.Geocoder();
    infoWindow = new window.google.maps.InfoWindow({map: map});

    ///////// Position = Golden Gate Bridge
    position = new google.maps.LatLng(37.820667, -122.478526);

    // Try HTML5 geolocation.
    if (onSpot){
        console.log("Using HTML5 geolocation");
        if (navigator.geolocation) {
            MapObject.usingHTML5Geolocation();
        } else {
            browserDoesntSupportGeoLocation();
            // Browser doesn't support Geolocation
            infoWindow.setPosition(position);
            infoWindow.setContent("Error: Your browser doesn't support geolocation.");
            infoWindow.open(map);
        }
    } else { // Set the loaction to fallback
        MapObject.fallback();
    }
    /////// Display basic map
    var mapDiv = document.getElementById("mymap");
    map = new google.maps.Map(mapDiv, JSONHelper.createMapOptions());
    //Add listener
    google.maps.event.addListener(map, "click", MapObject.addRestaurantDialog);
    google.maps.event.addListener(map, "idle", MapObject.mapIdleListener);
    google.maps.event.addListener(map, 'mousemove', function (event) {
        MapObject.displayCoordinates(event.latLng);
    });
    refilterList();
}

/**
 * Limit to the current location...
 */
function refilterList() {
    request = JSONHelper.createRequest(position);
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

/**
 * Callback for filtering restaurants.
 * @param results found places by google
 * @param status
 */
function callback(results, status) {
    var filterRestaurants = [];
    bounds = new google.maps.LatLngBounds();
    for (var j = 0; j < results.length; j++) {
        var marker = JSONHelper.createMarker(map, results[j]);

        var data = JSONHelper.dataHelper(results[j]);
        filterRestaurants.push(data);
        google.maps.event.addListener(marker, "click", MapObject.clickListener);
        bounds.extend(results[j].geometry.location);
    }
    Storage.save(Storage.RESTAURANTS, filterRestaurants);
    // Storage.memoryDump( Storage.RESTAURANTS);

    MapObject.listRestaurants();
    map.fitBounds(bounds);
}

