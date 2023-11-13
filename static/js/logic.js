// Creating my background map layer.
let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
        attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
);
// Creating my map object with the heart of the US as the center.
let map = L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 3
});
// Adding the background map layer to my map.
basemap.addTo(map);

// Pulling in earthquake geoJSON data and get data from the past month. Logging the data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function (data) {
    console.log(data)
    // Adding in styling for each earthquake point on the map. 
    function iconStyling(features) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: addingColor(features.geometry.coordinates[2]),
            color: "#000000",
            radius: addingRadius(features.properties.mag),
            stroke: true,
            weight: 1
        };
    }
    // Making the colors all purple but it gets darker as it gets deeper
    function addingColor(depth) {
        switch (true) {
            case depth > 90:
                return "#20124d";
            case depth > 70:
                return "#351c75";
            case depth > 50:
                return "#674ea7";
            case depth > 30:
                return "#8e7cc3";
            case depth > 10:
                return "#b4a7d6";
            default:
                return "#d9d2e9";
        }
    }


// Creating the function to get the magnitude from the data and relate it to radius size.
// Getting rid of 0 value magnitudes
    function addingRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 6;
    }
// Plotting each 'feature' at the correct latitude and longitude.
    L.geoJson(data, {
        pointToLayer: function (features, latandlong) {
            return L.circleMarker(latandlong);
        },
        // Adding in styling defined previously.
        style: iconStyling,
        // Add in pop up that displays magnitude, depth, location, and a URL for the event.
        onEachFeature: function (features, layer) {
            layer.bindPopup(
                "Magnitude: " +
                features.properties.mag +
                "<br>Depth: " +
                features.geometry.coordinates[2] +
                "<br>Location: " +
                features.properties.place +
                "<br>URL Link for the Event: " +
                features.properties.url
            );
        }
    // Add each point with styling and pop up to the map
    }).addTo(map);
    // Creating my legend variable and adding it to the bottom right of the map. 
    let legend = L.control({
        position: "bottomright"
    });
    // Creating the legend details 
    legend.onAdd = function () {
        // Creating the div variable to add my legend with details to the map
        let div = L.DomUtil.create("div", "info legend");
        // Creating the chunks for depth with corresponding purple color.
        let depthchunks = [-10, 10, 30, 50, 70, 90];
        let colorchunks = [
            "#d9d2e9",
            "#b4a7d6",
            "#8e7cc3",
            "#674ea7",
            "#351c75",
            "#20124d"
        ];
        // Creating a for loop to loop through my depthchunks list, returning the corresponding color, 
        // and adding the depthchunks values with a dash to separate values.
        for (let i = 0; i < depthchunks.length; i++) {
            div.innerHTML +=
                "<i style='background: " +
                colorchunks[i] +
                "'></i> " +
                depthchunks[i] +
                (depthchunks[i + 1] ? "&ndash;" + depthchunks[i + 1] + "<br>" : "+");
        }
        return div;
    };
    // Adding legend to map.
    legend.addTo(map);


});