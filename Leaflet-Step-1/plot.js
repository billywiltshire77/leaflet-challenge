let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(url).then((data) => {
    configureMap(data.features)
})

function configureMap(earthquakeData) {
    console.log(earthquakeData)

    function onEachEarthquake(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
      }

      var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachEarthquake
      });

      createMap(earthquakes);
}

function createMap(earthquakes) {

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let baseMaps = {
        "Street Map": street,
      };
    
      // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
      };

    let myMap = L.map("map", {
        center: [
          0,0
        ],
        zoom: 1,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}