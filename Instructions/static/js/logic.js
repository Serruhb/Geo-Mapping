// geoJson lin
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

//Get request to query the URL
d3.json(queryUrl, function(data) {
    console.log(data.features);
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + " Magnitude" + feature.properties.mag + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    function markersize(magnitude) {
        return magnitude * 4;
    };

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.75,
            fillColor: "#000099",
            // getColor(feature.properties.mag),
            color: "#000099",
            radius: markersize,
            stroke: false,
            weight: 0.75
        };
    };



    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        }
    });


    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap 
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> Is it really that interesting to see this?</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Define satelliteMap 
    var satelliteMap = L.tileLayer("https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org/\">OpenStreetMap</a> Really? REALLY?</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Satellite": satelliteMap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
    };


    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, satelliteMap, earthquakes]
    });


    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false

    }).addTo(myMap);

    // Make a function to return the style data for each point of quakes for color and radius 

    earthquakes.addTo(myMap);

};