////////////////////////////
// Map Object
////////////////////////////
function MapObject() {
    this.zoom = 13;
    this.maptype = 'roadmap';
    this.place_formatted = '';
    this.place_id = '';
    this.place_location = '';
    this.coordinates = {lat: 49.533333, lng: 8.35};

    this.showZoom = function () {
        console.log(this.zoom);
    };
}
/**
 * Load data asynch by Ajax
 */

///////////////////////////
// Restaurant Review
///////////////////////////
function RestaurantReview(lat, lng){
    this.lat = lat;
    this.lng = lng;
    $.getJSON("./assets/data/Restaurants.json", function (data) {
        var restaurants_json = data['restaurants'];
        let restaurantsHelper = RestaurantReview.getRestaurants();
        for (var i = 0; i < restaurants_json.length; i++) {
            // restaurantsHelper.push(restaurants_json[i]);
            // RestaurantReview.numberOfRestaurants++;
            console.log(restaurants_json[i]);
        }
        // console.log(RestaurantReview.numberOfRestaurants);
    });
}


RestaurantReview.restaurants = [];

RestaurantReview.numberOfRestaurants  = function () {
    return this.restaurants.length;
};

RestaurantReview.getRestaurants = function () {
    return this.restaurants;
};

function fromSelectionChanged(){
    console.log("fromSelectionChanged()");
}

function toSelectionChanged(){
    console.log("toSelectionChanged()");
}
