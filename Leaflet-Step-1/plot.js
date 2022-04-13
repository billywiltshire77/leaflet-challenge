let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(url).then((data) => {
    configureMap(data.features)
})

function configureMap(earthquakeData) {
    console.log(earthquakeData)

    function markerSize(felt) {
        return Math.sqrt(felt) * 100000;
    }

    function onEachEarthquake(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
        
        quakeMarkers = []
        for (let quake of earthquakeData) {
        if (quake.properties.mag > 7) {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                stroke: false,
                fillOpacity: 0.75,
                color: "black",
                fillColor: "red",
                radius: markerSize(quake.properties.felt)
                }).bindPopup('Popup')
            );
        } else if (quake.properties.mag > 5) {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "orange",
                  radius: markerSize(quake.properties.felt)
                }).bindPopup('Popup')
            );
        } else if (quake.properties.mag > 3) {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "yellow",
                  radius: markerSize(quake.properties.felt)
                }).bindPopup('Popup')
            );
        } else {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "green",
                  radius: markerSize(quake.properties.felt)
                }).bindPopup('Popup')
            );
        }
        }
    }

    let earthquakes = L.geoJSON(earthquakeData, {
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
    
    console.log(quakeMarkers)
    let quakes = L.layerGroup(quakeMarkers);

    let overlayMaps = {
        Earthquakes: earthquakes,
        Size: quakes
      };

    let myMap = L.map("map", {
        center: [
          0,0
        ],
        zoom: 1,
        layers: [street, earthquakes, quakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}