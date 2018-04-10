var TemplateEngine = {
    addNewRestaurantDialog:function(position){
        return "<div class='wrapperAddRestaurant'>" +
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
            "    <button type='button' onClick='MapObject.saveNewRestaurant()'  id='saveRestaurantButton'>Save</button> " +
            "    <button type='button' onClick='MapObject.abortSaveRestaurant()' class='abortButton'>Abort</button> " +
            "</div> ";
    },
    editRestaurant:function(){
        if (MapObject.currentSelectedRestaurant === null){
            return "error";
        }
        var contentString = "<div class='wrapperAddRestaurant'>" +
            "      <div>" +
            "            <h4>Edit a Restaurant...</h4> " +
            "      </div>" +
            "      <div class='one'> " +
            "            <label for='nameRestaurantNew'>Name:</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "            <input type='text' id='nameRestaurantNew' placeholder='Name' value='"+MapObject.currentSelectedRestaurant.restaurantName+"'> " +
            "      </div>" +
            "      <div class='one'> " +
            "            <label for='streetRestaurantNew'>Street:</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "            <input type='text' id='streetRestaurantNew' placeholder='Street' value='"+MapObject.currentSelectedRestaurant.address_street+"'> " +
            "      </div> " +
            "    <div class='one'> " +
            "        <label for='cityRestaurantNew'>City:</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "        <input type='text' id='cityRestaurantNew' placeholder='city' value='"+MapObject.currentSelectedRestaurant.address_city+"'> " +
            "    </div> " +
            "    <div class='one'> " +
            "        <label for='gpsRestaurantNew'>GPS(lat/lng):</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "        <input type='text' id='gpsRestaurantNew' placeholder='(Autofilled)' value='"+MapObject.currentSelectedRestaurant.lat+"/"+MapObject.currentSelectedRestaurant.lng+"'> " +
            "    </div> " +
            "    <div class='one'> " +
            "        <label for='starsRestaurantNew'>Stars of the Restaurant:</label> " +
            "      </div>" +
            "      <div class='one'>" +
            "        <input type='number' id='starsRestaurantNew' min='1' max='5' class='form-control' value='"+MapObject.currentSelectedRestaurant.stars+"'> " +
            "    </div> " +
            "    <div class='one'> " +
            "        <label for='ratingRestaurantNew'>Rating:</label> " +
            "      </div>"+
            "        <div id='ratingRestaurantNew' class='one'> ";
        for (var r=0; r<MapObject.currentSelectedRestaurant.ratings.length; r++){
            contentString +=
                "            <span> " +
                "                <input type='number' id='starsRatingRestaurantNew' min='1' max='5' value='"+MapObject.currentSelectedRestaurant.ratings[r].stars+"'> " +
                "                <input type='text' id='ratingRestaurantTextNew' placeholder='Tell us what you think...' value='"+MapObject.currentSelectedRestaurant.ratings[r].comment+"'> " +
                "            </span><br> ";
            console.log(MapObject.currentSelectedRestaurant.ratings[r]);
        }
        contentString +=
            "        </div> " +
            "</div> " +
            "<div class='one'>" +
            "    <button type='button' onClick='MapObject.saveRestaurant()'  id='saveRestaurantButton'>Save</button> " +
            "    <button type='button' onClick='MapObject.abortSaveEditRestaurant()' class='abortButton'>Abort</button> " +
            "</div> ";
        return contentString;
    },
    existingRestaurantTemplate:function(){
        return "<h4><div id='title' style='margin-left: 10px;' /></h4>" +
            "<div class='wrapper'>" +
            "   <div id='street-view'></div>" +
            "   <div id='reviews'></div>" +
            "   <div><h4>Your Rating:</h4></div>" +
            "   <div>" +
            "    <span>" +
            "         <input type='number' id='starsAddRating' min='1' max='5'>" +
            "         <input type='text' id='ratingTextAddRating'  placeholder='Tell us what you think...'>" +
            "    </span>" +
            "   </div>" +
            "</div>"+
            "<div class='one'>" +
            "    <button type='button' onClick='MapObject.saveEditRestaurant()'  id='saveRestaurantButton'>Save</button> " +
            "    <button type='button' onClick='MapObject.abortSaveRestaurant()' class='abortButton'>Abort</button> " +
            "</div> ";
    },
    noPictureDialog: function(){
        return "<h4><div id='title'  style='margin-left: 10px;' /></h4>" +
            "<div class='wrapper'>" +
            "   <div>" +
            "      We deeply regret, unfortunately there is no picture available for this establishment." +
            "   </div>" +
            "   <div id='reviews'></div>" +
            "   <div><h4>Your Rating:</h4></div>" +
            "   <div>" +
            "     <span>" +
            "         <input type='number' id='starsAddRating' min='1' max='5'>" +
            "         <input type='text' id='ratingTextAddRating'  placeholder='Tell us what you think...'>" +
            "     </span>" +
            "   </div>" +
            "</div> " +
            "<div class='one'>" +
            "    <button type='button' onClick='MapObject.saveEditRestaurant()'  id='saveRestaurantButton'>Save</button> " +
            "    <button type='button' onClick='MapObject.abortSaveRestaurant()' class='abortButton'>Abort</button> " +
            "</div> ";
    }
};
