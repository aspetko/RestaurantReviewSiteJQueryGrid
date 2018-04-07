var MapObject = {
    markerAddRestaurant: null,
    addRestaurantOpen: false,
    addRestaurantInfowindow: null,
    infow: null,
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
    closeInfoW: function () {
        MapObject.infow.close();
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
    clickListenerRestaurant: function () {
        var marker = this;
        console.log(marker.restaurant_id);
        var restaurants = Storage.load(Storage.RESTAURANTS);
        var restaurant = "";
        for (var i=0; i<restaurants.length; i++){
            if (restaurants[i].id === marker.restaurant_id){
                restaurant = restaurants[i];
                console.log(" restaurant found ");
            }
        }
        if (MapObject.addRestaurantOpen) {
            MapObject.closeAddRestaurantDialog();
        }
        var contentString = "<div class='wrapperAddRestaurant'>" +
            "      <div>" +
            "            <h4>Edit a Restaurant...</h4> " +
            "      </div>" +
            "      <div class='one'> " +
            "            <label for='nameRestaurantNew'>Name:</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "            <input type='text' id='nameRestaurantNew' placeholder='Name' value='"+restaurant.restaurantName+"'> " +
            "      </div>" +
            "      <div class='one'> " +
            "            <label for='streetRestaurantNew'>Street:</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "            <input type='text' id='streetRestaurantNew' placeholder='Street' value='"+restaurant.address_street+"'> " +
            "      </div> " +
            "    <div class='one'> " +
            "        <label for='cityRestaurantNew'>City:</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "        <input type='text' id='cityRestaurantNew' placeholder='city' value='"+restaurant.address_city+"'> " +
            "    </div> " +
            "    <div class='one'> " +
            "        <label for='gpsRestaurantNew'>GPS(lat/lng):</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "        <input type='text' id='gpsRestaurantNew' placeholder='(Autofilled)' value='"+restaurant.lat+"/"+restaurant.lng+"'> " +
            "    </div> " +
            "    <div class='one'> " +
            "        <label for='starsRestaurantNew'>Stars of the Restaurant:</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "        <input type='number' id='starsRestaurantNew' min='1' max='5' class='form-control' value='"+restaurant.stars+"'> " +
            "    </div> " +
            "    <div class='one'> " +
            "        <label for='ratingRestaurantNew'>Rating:</label> " +
            "      </div>"+
            "        <div id='ratingRestaurantNew' class='one'> ";
       for (var r=0; r<restaurant.ratings.length; r++){
           contentString +=
               "            <span> " +
               "                <input type='number' id='starsRatingRestaurantNew' min='1' max='5' value='"+restaurant.ratings[r].stars+"'> " +
               "                <input type='text' id='ratingRestaurantTextNew' placeholder='Tell us what you think...' value='"+restaurant.ratings[r].comment+"'> " +
               "            </span><br> ";
            console.log(restaurant.ratings[r]);
        }
       contentString +=
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

        MapObject.addRestaurantInfowindow.open(map, MapObject.markerAddRestaurant);
        console.log(restaurant);
    },
    clickListener: function () {
        var marker = this;
        var lookTo = marker.getPosition();
        var service = new google.maps.StreetViewService();

        var STREETVIEW_MAX_DISTANCE = 1000;

        var content = "<h4><div id='title'/><button type='button' onclick='MapObject.closeInfoW()' class='close'>&times;</button></h4>" +
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
        var myOptions = {
            content: content
            , disableAutoPan: false
            , maxWidth: 0
            , pixelOffset: new google.maps.Size(-140, 80)
            , zIndex: null
            , boxStyle: {
                background: "url('images/tipbox.gif') no-repeat"
                , opacity: 0.90
                , width: "280px"
            }
            , closeBoxMargin: "2px 2px 2px 2px"
            , closeBoxURL: "images/close.gif"
            , infoBoxClearance: new google.maps.Size(1, 1)
            , isHidden: false
            , pane: "floatPane"
            , enableEventPropagation: false
        };

        MapObject.infow = new google.maps.InfoWindow({content: content, width: "500px"});
        MapObject.infow.open(map, marker);
        var panoramaDiv = document.getElementById("street-view");
        // var panorama = new google.maps.StreetViewPanorama(panoramaDiv, JSONHelper.streetViewHelper(lookTo));
        var fenway = {lat: 42.345573, lng: -71.098326};
        var map = new google.maps.Map(document.getElementById('mymap'), {
            center: fenway,
            zoom: 14
        });
        var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('street-view'), {
                position: fenway,
                pov: {
                    heading: 34,
                    pitch: 10
                }
            });
        map.setStreetView(panorama);
        //
        // var url = "https://maps.googleapis.com/maps/api/streetview/metadata?location="+
        //     marker.getPosition().lat()+
        //     ","+
        //     marker.getPosition().lng()+
        //     "&key=AIzaSyAWvxZeVcusN6MQAdW8Y6RnJnf3vN1uR6Q";
        //
        // service.getPanoramaByLocation(panorama.getPosition(), STREETVIEW_MAX_DISTANCE, function (panoData, status) {
        //     $.get(url, function (data) {
        //         if (data.status === 'OK') {
        //             $.get(MapObject.createLocation(marker), function (data) {
        //                 if (panoData != null) {
        //                     var heading = google.maps.geometry.spherical.computeHeading(panoData.location.latLng, lookTo);
        //                     var pov = panorama.getPov();
        //
        //                     pov.heading = heading;
        //                     panorama.setPov(pov);
        //
        //                     // Reference to the DIV which receives the contents of the infowindow using jQuery
        //                     var iwOuter = $('.gm-style-iw');
        //
        //                     /* The DIV we want to change is above the .gm-style-iw DIV.
        //                      * So, we use jQuery and create a iwBackground variable,
        //                      * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
        //                      */
        //                     var iwBackground = iwOuter.prev();
        //
        //                     // Remove the background shadow DIV
        //                     iwBackground.children(':nth-child(2)').css({'display' : 'none'});
        //
        //                     // Remove the white background DIV
        //                     iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        //                     console.log("panorama", panorama);
        //
        //                     var test = $("#street-view").css("min-width", "1000px");
        //                     console.log("test", test);
        //
        //
        //                 }
        //             });
        //         } else {
        //             MapObject.infow.close();
        //             content = "<h4><div id='title'/><button type='button' onclick='MapObject.closeInfoW()' class='close'>&times;</button></h4>" +
        //                 "<div class='wrapper'>" +
        //                 "<div>" +
        //                 "We deeply regret, unfortunately there is no picture available for this establishment." +
        //                 "<div id='reviews'/>" +
        //                 "<div><h4>Your Rating:</h4></div>" +
        //                 "<div>" +
        //                 "    <input type='number' id='starsAddRating' min='1' max='5'>" +
        //                 "</div>" +
        //                 "<div>" +
        //                 "    <input type='text' id='ratingTextAddRating'  placeholder='Tell us what you think...'>" +
        //                 "</div>" +
        //                 "<button type='button'>Close</button>" +
        //                 "</div>";
        //             // jQuery('.gm-style-iw').prev('div').remove();
        //             // jQuery('.gm-style-iw').prev('div').css("background: linear-gradient(blue, lightblue);");
        //
        //             MapObject.infow = new google.maps.InfoWindow({content: content, maxWidth: 500});
        //             MapObject.infow.open(map, marker);
        //         }
        //     });
        // });
        $('#title').append(marker.getTitle());
        $('#reviews').empty();
        $('#reviews').append("<p>Hello World</p>");
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
    }, guid:function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

};
