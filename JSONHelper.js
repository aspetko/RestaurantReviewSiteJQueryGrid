var JSONHelper = {
    createRequest:function(position){
        return {
              location: position,
              radius: '1000',
              type: ['restaurant']
          }
    },
    createIcon:function(){
        return {
            url: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
    },
    streetViewHelper:function(lookTo){
        return {
            position: lookTo,
            panControl: false,
            addressControl: false,
            linksControl: false,
            zoomControlOptions: false
        };
    },
    dataHelper:function(result){
        var starsHelper = (result.rating !== undefined? result.rating : "1");
        return {
            "id": result.place_id,
            "restaurantName": result.name,
            "address_street": result.vicinity.substring(0, result.vicinity.indexOf(",")),
            "address_city": result.vicinity.substring(result.vicinity.indexOf(",")+2),
            "lat": result.geometry.location.lat(),
            "lng": result.geometry.location.lng(),
            "stars": starsHelper,
            "ratings": [
            ]
        };
    },
    createRestaurantStructure:function(id, name, street, city, lat, lng, stars, rating_star, rating_comment){
        return {
            "id": id,
            "restaurantName": name,
            "address_street": street,
            "address_city": city,
            "lat": lat,
            "lng": lng,
            "stars": stars,
            "ratings": [{
                "stars": rating_star,
                "comment": rating_comment
            }
            ]};
    },
    createRestaurantStructureMultipleRatings:function(id, name, street, city, lat, lng, stars, ratings){
        return {
            "id": id,
            "restaurantName": name,
            "address_street": street,
            "address_city": city,
            "lat": lat,
            "lng": lng,
            "stars": stars,
            "ratings": ratings
        };
    },
    createMarker:function(map, result){
        return new google.maps.Marker({
            map: map,
            id: result.place_id,
            icon: JSONHelper.createIcon(),
            title: result.name,
            position: new google.maps.LatLng(
                result.geometry.location.lat(), result.geometry.location.lng()
            )
        });
    },
    createMapOptions:function(){
        return MapObject.restoreOptions(google.maps.ControlPosition.BOTTOM_LEFT,
            google.maps.ZoomControlStyle.DEFAULT,
            google.maps.MapTypeId.ROADMAP
            //     mapTypeId: google.maps.MapTypeId.SATELLITE
        );
    },
    createPictureUrl:function(marker){
        return "https://maps.googleapis.com/maps/api/streetview/metadata?location="+
            marker.getPosition().lat()+
            ","+
            marker.getPosition().lng()+
            "&key=AIzaSyAWvxZeVcusN6MQAdW8Y6RnJnf3vN1uR6Q";
    }
};
