(function(window, google){
        // 1. Introduction
        ///////// Position = Golden Gate Bridge
        var position = new google.maps.LatLng(37.820667, -122.478526);

        /////// Display basic map
        var mapDiv = document.getElementById("mymap");
        var mapOptions = {
            center: position,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // var mapOptions = {
        //     center: position,
        //     zoom: 15,
        //     mapTypeId: google.maps.MapTypeId.SATELLITE
        // };
        var map = new google.maps.Map(mapDiv, mapOptions);

    //////// Add a marker object
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: "Kann ich Ihnene einen Kaffee anbieten"
    });

    //////////// Info Window
    var infoWindow = new google.maps.InfoWindow({
        content: "This is golden <b>Gate</b> <i>Bridge</i>"
    });

    /////////// Click Event Listener
    google.maps.event.addListener(marker, 'click', function(){
        infoWindow.open(map, marker);
    });

    ///////// Bounds
    google.maps.event.addListener(map, 'bounds_changed', function(){
        var bounds = map.getBounds();
        var NE = bounds.getNorthEast();
        var SW = bounds.getSouthWest();
        var strHTML = "North East: ("+ NE.lat()+","+NE.lng()+") <br>South West: ("+SW.lat()+", "+SW.lng()+")";
        document.getElementById("status").innerHTML = strHTML;
    });

    /////// Add multiple locations
    var locations = [];
    locations.push({name: "Las Vegas", latlng: new google.maps.LatLng(36.255123, -115.2383485)});
    locations.push({name: "California", latlng: new google.maps.LatLng(36.778261, -119.4179324)});
    locations.push({name: "New York", latlng: new google.maps.LatLng(40.7143528, -74.0059730)});

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0 ; i<locations.length; i++){
        console.log("Setting marker "+i);
        var marker = new google.maps.Marker({position: locations[i].latlng, map: map, title: locations[i].name});
        bounds.extend(locations[i].latlng);
    }
    map.fitBounds(bounds);
    ////////// Geolocation
    var geocoder = new window.google.maps.Geocoder();
    var infoWindow = new window.google.maps.InfoWindow({map: map});
    //var pos = {lat: -33.8688, lng: 151.2195};
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            map.setCenter(pos);
        }, function () {
            pos = {
                lat: -33.8688,
                lng: 151.2195
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent("Error: The Geolocation service failed.");
        });
    } else {
        // Browser doesn't support Geolocation
        pos = {
            lat:  -33.8688,
            lng: 151.2195
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent("Error: Your browser doesn't support geolocation.");
    }

    //////////////// Places
    var  service = new google.maps.places.PlacesService(map);
    var request = {
        location: new google.maps.LatLng(-33.8665433,151.1956316),
        radius: 500,
        types: ['restaurant']
    };
    service.search(request, function(results){
        console.log(results.length);
        for (var  i = 0; i<results.length; i++){
            console.log(results[i].name, results[i].types);
        }
        console.log(results.length);
    });

})(window);