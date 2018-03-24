var Storage = {
    /** "Constant" for Restaurants */
    "RESTAURANTS": "restaurants",
    /** "Constant" for Stars beginning */
    "FROM_STARS": "fromStars",
    /** "Constant" for Stars end */
    "TO_STARS": "toStarts",
    /**
     * load Data from sessionstorage
     * @param key the key of the key value pair
     * @returns {any} the value or null if no value was assigned.
     */
    load:function(key){
     return JSON.parse(sessionStorage.getItem(key));
    },
    /**
     * Stores data to the sessionsorage.
     * @param key the key of the key value pair
     * @param json the json structure to save.
     */
    save:function(key, json){
        sessionStorage.setItem(key, JSON.stringify(json));
    },
    /**
     * Removes values from sessionstorage.
     * @param key the key to be removed
     */
    clear:function (key){
        sessionStorage.removeItem(key);
    },
    /**
     * Debugging method. Prints the content of the sessionstorage for a given key.
     * @param key The key that should be discovered.
     */
    memoryDump:function(key){
        console.log(key, sessionStorage.getItem(key));
    },
    /**
     * Remove all key-value pairs.
     */
    empty:function(){
        sessionStorage.clear();
    }
};
