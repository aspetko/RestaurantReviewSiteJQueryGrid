var MapObject = {
    markerAddRestaurant: null,
    addRestaurantOpen: false,
    addRestaurantInfowindow: null,
    /**
     * Filter the restaurant list limited to the current visible area.
     */
    listRestaurants: function () {
        var from = Storage.load(Storage.FROM_STARS);
        var to = Storage.load(Storage.TO_STARS);
        $('#restaurants').empty();
        var restaurantDiv = "";
        var restaurants = Storage.load(Storage.RESTAURANTS);
        for (var i = 0; i < restaurants.length; i++) {
            // Check if restaurant is within range of the customer's assumption
            if (restaurants[i].stars >= from && restaurants[i].stars <= to) {
                restaurantDiv += '<div class="restaurant"><h3>' + restaurants[i].restaurantName + '</h3><span>';
                // Draw the stars...
                for (var b = 0; b < 5; b++) {
                    // filled one's..
                    if (b < restaurants[i].stars) {
                        restaurantDiv += '&#10029;';
                    } else {
                        // empty one's
                        restaurantDiv += '&#10025;';
                    }
                }
                restaurantDiv += '</span><p>' + restaurants[i].address_street + '</p><p>' + restaurants[i].address_city + '</p></div>';
                $('#restaurants').append(restaurantDiv);
                restaurantDiv = "";
            }
        }
    },
    /**
     * This is a helper method. Used when I am working on the train. I needed a fixed point to get started and not every
     * time a different starting point.
     */
    fallback: function () {
        position = new google.maps.LatLng(48.171229, 11.746022);
        var currentLocation = new google.maps.Marker({
            position: position,
            map: map,
            title: "Using Fallback - (48.171229, 11.746022)"
        });
        infoWindow = new window.google.maps.InfoWindow({map: map});
        infoWindow.setPosition(position);
        infoWindow.setContent("Using Fallback - (48.171229, 11.746022)");
        infoWindow.open(map, currentLocation);
        $("#position").innerHTML = '<span>48.171229, 11.746022</span>';

    },
    displayCoordinates: function (pnt) {
        var lat = pnt.lat();
        // lat = lat.toFixed(4);
        var lng = pnt.lng();
        // lng = lng.toFixed(4);
        // console.log("Latitude: " + lat + "  Longitude: " + lng);
        $("#position").empty();
        $("#position").append('<p>' + pnt.lat() + ", " + pnt.lng() + '</p>');
    },
    createIcon: function () {
        return {
            url: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
    },
    restoreOptions: function (controlPosition, zoomControlStyle, mapTypeId) {
        return {
            center: position,
            disableDefaultUI: false,
            scrollWheel: true,
            draggable: true,
            maxZoom: 23,
            minZoom: 3,
            zoom: 15,
            zoomControlOptions: {
                position: controlPosition,
                style: zoomControlStyle
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
        };
    },
    addRestaurantDialog: function (event) {
        if (MapObject.addRestaurantOpen) {
            MapObject.closeAddRestaurantDialog();
        }
        position = new google.maps.LatLng(
            event.latLng.lat(), event.latLng.lng()
        );

        geocoder.geocode({'location': position}, function (results, status) {
            var contentString = "<div class='wrapperAddRestaurant'>" +
                "      <div>" +
                "            <h4>Add a new Restaurant...</h4> " +
                "      </div>" +
                "      <div class='one'> " +
                "            <label for='nameRestaurantNew'>Name:</label> " +
                "      </div>" +
                "      <div class='one'>" +
                "            <input type='text' id='nameRestaurantNew' placeholder='Name'> " +
                "      </div>" +
                "      <div class='one'> " +
                "            <label for='streetRestaurantNew'>Street:</label> " +
                "      </div>" +
                "      <div class='one'>" +
                "            <input type='text' id='streetRestaurantNew' placeholder='Street'> " +
                "      </div> " +
                "    <div class='one'> " +
                "        <label for='cityRestaurantNew'>City:</label> " +
                "      </div>" +
                "      <div class='one'>" +
                "        <input type='text' id='cityRestaurantNew' placeholder='city'> " +
                "    </div> " +
                "    <div class='one'> " +
                "        <label for='gpsRestaurantNew'>GPS(lat/lng):</label> " +
                "      </div>" +
                "      <div class='one'>" +
                "        <input type='text' id='gpsRestaurantNew' placeholder='(Autofilled)'> " +
                "    </div> " +
                "    <div class='one'> " +
                "        <label for='starsRestaurantNew'>Stars of the Restaurant:</label> " +
                "      </div>" +
                "      <div class='one'>" +
                "        <input type='number' id='starsRestaurantNew' min='1' max='5' class='form-control'> " +
                "    </div> " +
                "    <div class='one'> " +
                "        <label for='ratingRestaurantNew'>Rating:</label> " +
                "      </div>" +
                "        <div id='ratingRestaurantNew' class='one'> " +
                "            <span> " +
                "                <input type='number' id='starsRatingRestaurantNew' min='1' max='5'> " +
                "                <input type='text' id='ratingRestaurantTextNew' placeholder='Tell us what you think...'> " +
                "            </span> " +
                "        </div> " +
                "</div> " +
                "<div class='one'>" +
                "    <button type='button' onClick='MapObject.saveRestaurant()'  id='saveRestaurantButton'>Save</button> " +
                "    <button type='button' onClick='MapObject.abortSaveRestaurant()' class='abortButton'>Abort</button> " +
                "</div> ";

            MapObject.addRestaurantOpen = true;
            MapObject.addRestaurantInfowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 500
            });
            MapObject.markerAddRestaurant = new google.maps.Marker({
                position: position,
                map: map,
                title: 'Add a New Restaurant...'
            });
            MapObject.addRestaurantInfowindow.open(map, MapObject.markerAddRestaurant);
            if (status === 'OK') {
                if (results[0]) {
                    var input = results[0].formatted_address;
                    var addressStr = input.split(',', 3);
                    $("#streetRestaurantNew").val(addressStr[0].trim());
                    $("#cityRestaurantNew").val(addressStr[1].trim());
                    $("#gpsRestaurantNew").val(event.latLng.lat() + "/" + event.latLng.lng());

                } else {
                    $("#cityRestaurantNew").val('No results found');
                }
            } else {
                $("#cityRestaurantNew").val('Geocoder failed due to: ' + status);
            }
        });
    },
    displayBounds: function (bounds) {
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        $("#bounds_northEast").empty();
        $("#bounds_southWest").empty();
        $("#bounds_northEast").append('<p>' + southWest.lat() + ", " + southWest.lng() + '</p>');
        $("#bounds_southWest").append('<p>' + northEast.lat() + ", " + northEast.lng() + '</p>');
    },
    usingHTML5Geolocation: function () {
        navigator.geolocation.getCurrentPosition(function (thePosition) {
            position = {
                lat: thePosition.coords.latitude,
                lng: thePosition.coords.longitude
            };
            infoWindow.setPosition(position);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            console.log("Location found.");
            map.setCenter(position);
            $("#position").empty();
            $("#position").innerHTML = '<span>thePosition.coords.latitude+ ", " + thePosition.coords.longitude</span>';
            console.log("navigator.geolocation", onSpot, position);
        }, function () {
            infoWindow.setPosition(position);
            infoWindow.setContent("Error: The Geolocation service failed.");
        });
    },
    mapIdleListener: function () {
        MapObject.displayBounds(map.getBounds());
        Storage.save(Storage.FROM_STARS, $("#fromStars").val());
        Storage.save(Storage.TO_STARS, $("#toStars").val());
        MapObject.listRestaurants();
    },
    abortSaveRestaurant: function () {
        MapObject.addRestaurantInfowindow.close();
        MapObject.markerAddRestaurant.setMap(null);
        MapObject.addRestaurantOpen = false;
    },
    closeAddRestaurantDialog: function () {
        MapObject.addRestaurantInfowindow.close();
        MapObject.markerAddRestaurant.setMap(null);
        MapObject.addRestaurantOpen = false;
    },
    saveRestaurant: function () {
        var marker = new google.maps.Marker({
            restaurant_id: -1,
            position: position,
            map: map,
            title: $("#nameRestaurantNew").val()
        });
        var restaurants = Storage.load(Storage.RESTAURANTS);
        restaurants.push(JSONHelper.createRestaurantStructure($("#nameRestaurantNew").val(), $("#streetRestaurantNew").val(),
            $("#cityRestaurantNew").val(), position.lat(), position.lng(), $("#starsRestaurantNew").val(),
            $("#starsRatingRestaurantNew").val(), $("#ratingRestaurantTextNew").val()));
        Storage.save(Storage.RESTAURANTS, restaurants);
        Storage.memoryDump(Storage.RESTAURANTS);

        ///////////////////////////
        // Reseting Dialog Values
        $("#streetRestaurantNew").val("");
        $("#cityRestaurantNew").val("");
        $("#nameRestaurantNew").val("");
        $("#gpsRestaurantNew").val("");
        $("#starsRestaurantNew").val("");
        $("#ratingRestaurantNew").val("");
        MapObject.addRestaurantInfowindow.close();
    },
    clickListener: function () {
        var marker = this;
        var lookTo = marker.getPosition();
        var service = new google.maps.StreetViewService();

        var STREETVIEW_MAX_DISTANCE = 1000;

        var content = "<h4><div id='title'/><button type='button' class='close'>&times;</button></h4>" +
            "<div class='wrapper'>" +
            "<div id='street-view'/>" +
            "<div id='reviews'/>" +
            "<div><h4>Your Rating:</h4></div>" +
            "<div>" +
            "    <input type='number' id='starsAddRating' min='1' max='5'>" +
            "</div>" +
            "<div>" +
            "    <input type='text' id='ratingTextAddRating'  placeholder='Tell us what you think...'>" +
            "</div>" +
            "<button type='button'>Close</button>" +
            "</div>";
        // jQuery('.gm-style-iw').prev('div').remove();
        // jQuery('.gm-style-iw').prev('div').css("background: linear-gradient(blue, lightblue);");

        var infow = new google.maps.InfoWindow({content: content, maxWidth: 500});
        infow.open(map, marker);
        var panoramaDiv = document.getElementById("street-view");
        var panorama = new google.maps.StreetViewPanorama(panoramaDiv, JSONHelper.streetViewHelper(lookTo));

        service.getPanoramaByLocation(panorama.getPosition(), STREETVIEW_MAX_DISTANCE, function (panoData, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                $.get(MapObject.createLocation(marker), function (data) {
                    if (panoData != null) {
                        var heading = google.maps.geometry.spherical.computeHeading(panoData.location.latLng, lookTo);
                        var pov = panorama.getPov();

                        pov.heading = heading;
                        panorama.setPov(pov);
                        var theMarker = new google.maps.Marker({
                            map: panorama,
                            position: lookTo
                        });
                    }
                });
            } else if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
                var content = "<h4><div id='title'/><button type='button' class='close'>&times;</button></h4>" +
                    "<div class='wrapper'>" +
                    "<div>" +
                    "We deeply regret, unfortunately there is no picture available for this establishment." +
                    "<div id='reviews'/>" +
                    "<div><h4>Your Rating:</h4></div>" +
                    "<div>" +
                    "    <input type='number' id='starsAddRating' min='1' max='5'>" +
                    "</div>" +
                    "<div>" +
                    "    <input type='text' id='ratingTextAddRating'  placeholder='Tell us what you think...'>" +
                    "</div>" +
                    "<button type='button'>Close</button>" +
                    "</div>";
                // jQuery('.gm-style-iw').prev('div').remove();
                // jQuery('.gm-style-iw').prev('div').css("background: linear-gradient(blue, lightblue);");

                var infow = new google.maps.InfoWindow({content: content, maxWidth: 500});
                infow.open(map, marker);
            } else if (status === google.maps.StreetViewStatus.UNKNOWN_ERROR) {
                console.error("An UNKNOWN_ERROR occured ");
            }

        });
        $('#title').append(marker.getTitle());
        $('#reviews').empty();
        $('#reviews').append("<p>Hello World</p>");

        var street = new google.maps.StreetViewPanorama(document.getElementById("street-view"), {
            position: panorama.getPosition(),
            zoomControl: false,
            enableCloseButton: false,
            addressControl: false,
            panControl: false,
            linksControl: false
        });

    },
    createLocation: function (marker) {
        return "https://maps.googleapis.com/maps/api/streetview/metadata?location=" +
            marker.getPosition().lat() +
            "," +
            marker.getPosition().lng() +
            "&key=AIzaSyAWvxZeVcusN6MQAdW8Y6RnJnf3vN1uR6Q";
    },
    selectionChanged:function(){
    Storage.save(Storage.FROM_STARS, $("#fromStars").val())
    Storage.save(Storage.TO_STARS, $("#toStars").val())
    MapObject.listRestaurants();
}


};
