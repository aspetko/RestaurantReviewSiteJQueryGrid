var MapObject = {
    markerAddRestaurant: null,
    addRestaurantOpen: false,
    addRestaurantInfowindow: null,
    currentSelectedRestaurant: null,
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
     * time a different starting position.
     */
    fallback: function () {
        console.log("Using Fallback...");
        position = new google.maps.LatLng(48.171229, 11.746022);
        var currentLocationMarker = new google.maps.Marker({
            position: position,
            title: "Using Fallback - (48.171229, 11.746022)"
        });

        infoWindow = new window.google.maps.InfoWindow({map: map});
        // infoWindow.setPosition(position);
        // infoWindow.setContent("<p>Using Fallback - (48.171229, 11.746022)</p>");
        infoWindow.open(map, currentLocationMarker);
        // $("#position").innerHTML = '<span>48.171229, 11.746022</span>';

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
            MapObject.addRestaurantOpen = true;
            MapObject.addRestaurantInfowindow = new google.maps.InfoWindow({
                content: TemplateEngine.addNewRestaurantDialog(position),
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
            $(".gm-style-iw").css("width","500px");
        });
    },
    displayBounds: function (bounds) {
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        // $("#bounds_northEast").empty();
        // $("#bounds_southWest").empty();
        // $("#bounds_northEast").append('<p>' + southWest.lat() + ", " + southWest.lng() + '</p>');
        // $("#bounds_southWest").append('<p>' + northEast.lat() + ", " + northEast.lng() + '</p>');
    },
    usingHTML5Geolocation: function () {
        navigator.geolocation.getCurrentPosition(function (thePosition) {
            var position = {
                lat: thePosition.coords.latitude,
                lng: thePosition.coords.longitude
            };
            infoWindow.setPosition(position);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(position);
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
        if (MapObject.markerAddRestaurant !== null) {
            MapObject.markerAddRestaurant.setMap(null);
        }
        MapObject.addRestaurantOpen = false;
    },
    closeAddRestaurantDialog: function () {
        MapObject.addRestaurantInfowindow.close();
        MapObject.markerAddRestaurant.setMap(null);
        MapObject.addRestaurantOpen = false;
    },
    saveRestaurant: function () {
        var id = this.guid();
        var marker = new google.maps.Marker({
            restaurant_id: id,
            position: position,
            map: map,
            title: $("#nameRestaurantNew").val()
        });
        var restaurants = Storage.load(Storage.RESTAURANTS);
        var restaurantsReplaceHelper = [];
        console.log("saveRestaurant", MapObject.currentSelectedRestaurant.id);

        for (var i=0; i<restaurants.length; i++){
            if (restaurants[i].id === MapObject.currentSelectedRestaurant.id){
                var data = JSONHelper.createRestaurantStructure(
                    restaurants[i].id,
                    restaurants[i].restaurantName,
                    restaurants[i].address_street,
                    restaurants[i].address_city,
                    restaurants[i].lat,
                    restaurants[i].lng,
                    restaurants[i].stars,
                    $("#starsAddRating").val(),
                    $("#ratingTextAddRating").val()
                );
                restaurantsReplaceHelper.push(data);
            } else {
                restaurantsReplaceHelper.push(restaurants[i]);
            }
        }
        Storage.save(Storage.RESTAURANTS, restaurantsReplaceHelper);
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
        google.maps.event.addListener(marker, "click", this.clickListenerRestaurant);
        this.listRestaurants();
    },
    saveNewRestaurant: function () {
        var id = this.guid();
        var marker = new google.maps.Marker({
            restaurant_id: id,
            position: position,
            map: map,
            title: $("#nameRestaurantNew").val()
        });
        var restaurants = Storage.load(Storage.RESTAURANTS);
        restaurants.push(JSONHelper.createRestaurantStructure(id, $("#nameRestaurantNew").val(), $("#streetRestaurantNew").val(),
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
        google.maps.event.addListener(marker, "click", this.clickListenerRestaurant);
        this.listRestaurants();
    },
    saveEditRestaurant: function () {
        var restaurants = Storage.load(Storage.RESTAURANTS);
        var restaurantsReplaceHelper = [];
        var ratingsHelper = [];
        var star = $("#starsAddRating").val();
        var comment = $("#ratingTextAddRating").val();
        var array = { star, comment };
        ratingsHelper.push(array);

        for (var i=0; i<restaurants.length; i++){
            if (restaurants[i].id === MapObject.currentSelectedRestaurant.id){
                if (restaurants[i].ratings.length > 0){
                    for (var r =0; r<restaurants[i].ratings.length; r++){
                        ratingsHelper.push(
                            restaurants[i].ratings[r]
                        );
                    }
                }
                var data = JSONHelper.createRestaurantStructureMultipleRatings(
                    restaurants[i].id,
                    restaurants[i].restaurantName,
                    restaurants[i].address_street,
                    restaurants[i].address_city,
                    restaurants[i].lat,
                    restaurants[i].lng,
                    $("#starsRestaurantNew").val(),
                    ratingsHelper
                );
                restaurantsReplaceHelper.push(data);
            } else {
                restaurantsReplaceHelper.push(restaurants[i]);
            }
        }
        Storage.save(Storage.RESTAURANTS, restaurantsReplaceHelper);
        MapObject.addRestaurantOpen = false;
        MapObject.addRestaurantInfowindow.close();
        Storage.memoryDump(Storage.RESTAURANTS);
    },
    abortSaveEditRestaurant: function () {
        MapObject.addRestaurantOpen = false;
        MapObject.addRestaurantInfowindow.close();
    },
    clickListenerRestaurant: function () {
        var marker = this;
        var restaurants = Storage.load(Storage.RESTAURANTS);

        for (var i=0; i<restaurants.length; i++){
            if (restaurants[i].id === marker.restaurant_id){
                MapObject.currentSelectedRestaurant = restaurants[i];
            }
        }
        if (MapObject.addRestaurantOpen) {
            MapObject.closeAddRestaurantDialog();
        }
        MapObject.addRestaurantOpen = true;
        MapObject.addRestaurantInfowindow = new google.maps.InfoWindow({
            content: TemplateEngine.editRestaurant(),
            maxWidth: 500
        });

        MapObject.addRestaurantInfowindow.open(map, MapObject.markerAddRestaurant);
    },
    clickListener: function () {
        var marker = this;
        var lookTo = marker.getPosition();
        var service = new google.maps.StreetViewService();

        var restaurants = Storage.load(Storage.RESTAURANTS);
        for (var i=0; i<restaurants.length; i++){
            if (restaurants[i].id === marker.id) {
                MapObject.currentSelectedRestaurant = restaurants[i];
            }
        }

        var STREETVIEW_MAX_DISTANCE = 1000;
        MapObject.addRestaurantInfowindow = new google.maps.InfoWindow({content: TemplateEngine.existingRestaurantTemplate(), width: "200px"});
        MapObject.addRestaurantInfowindow.open(map, marker);
        var panoramaDiv = document.getElementById("street-view");
        var panorama = new google.maps.StreetViewPanorama(panoramaDiv, JSONHelper.streetViewHelper(lookTo));

        service.getPanoramaByLocation(panorama.getPosition(), STREETVIEW_MAX_DISTANCE, function (panoData, status) {
            $.get(JSONHelper.createPictureUrl(marker), function (data) {
                if (data.status === 'OK') { // Picture is availible
                    $.get(MapObject.createLocation(marker), function (data) {
                        if (panoData != null) {
                            var heading = google.maps.geometry.spherical.computeHeading(panoData.location.latLng, lookTo);
                            var pov = panorama.getPov();

                            pov.heading = heading;
                            panorama.setPov(pov);
                        }
                    });
                } else { // No Picture is available
                    MapObject.addRestaurantInfowindow.close();
                    MapObject.addRestaurantInfowindow = new google.maps.InfoWindow(
                        {content: TemplateEngine.noPictureDialog(),
                            maxWidth: 500}
                        );
                    MapObject.addRestaurantInfowindow.open(map, marker);
                }
            });
        });
        $('#title').append(marker.getTitle());

        var restaurants = Storage.load(Storage.RESTAURANTS);
        var contentString = "";

        for (var i=0; i<restaurants.length; i++){
            if (restaurants[i].id === marker.id){
                if (restaurants[i].ratings.length===0){
                    contentString += "<div>";
                    for (var b = 0; b < 5; b++) {
                        contentString += '&#10025;';
                    }
                    contentString += "</div>";
                    contentString += "<div>";
                    contentString += "No comments yet...";
                    contentString += "</div>";
                    console.log("No comments yet...");
                } else {
                    contentString += "";
                    for (var r = 0; r<restaurants[i].ratings.length; r++){
                        contentString += "<div>";
                        for (var b = 0; b < 5; b++) {
                            // filled one's..
                            if (b < restaurants[i].ratings[r].stars) {
                                contentString += '&#10029;';
                            } else {
                                // empty one's
                                contentString += '&#10025;';
                            }
                        }
                        contentString += "</div>";
                        contentString += "<div>";
                        contentString += restaurants[i].ratings[r].comment;
                        contentString += "</div>";
                    }
                    console.log("Comments found", contentString);
                }
            }
        }
        $('#reviews').empty();
        $('#reviews').append(contentString);
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
    },
    guid:function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

};
