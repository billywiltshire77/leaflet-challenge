let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

d3.json(url).then((data) => {
    configureMap(data.features)
})

function configureMap(earthquakeData) {
    console.log(earthquakeData)

    function markerSize(felt) {
        return Math.sqrt(felt) * 1000;
    }

    function onEachEarthquake(feature, layer) {
        
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
                }).bindPopup(`<h3> ${quake.properties.title}</h3><hr><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>Felt By: ${quake.properties.felt} People</p>`)
            );
        } else if (quake.properties.mag > 5) {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "orange",
                  radius: markerSize(quake.properties.felt)
                }).bindPopup(`<h3> ${quake.properties.title}</h3><hr><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>Felt By: ${quake.properties.felt} People</p>`)
            );
        } else if (quake.properties.mag > 3) {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "yellow",
                  radius: markerSize(quake.properties.felt)
                }).bindPopup(`<h3> ${quake.properties.title}</h3><hr><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>Felt By: ${quake.properties.felt} People</p>`)
            );
        } else {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "green",
                  radius: markerSize(quake.properties.felt)
                }).bindPopup(`<h3> ${quake.properties.title}</h3><hr><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>Felt By: ${quake.properties.felt} People</p>`)
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
        Earthquakes: quakes,
      };

    let myMap = L.map("map", {
        center: [
          0,0
        ],
        zoom: 2,
        layers: [street, quakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
// Started Legend Code, needs to be finished.
// let legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     let div = L.DomUtil.create("div", "info legend");
//     let labels = [];
//     let categories = ["Very Strong", "Strong", "Medium", "Weak"];

//     // Add the minimum and maximum.
//     let legendInfo = ["<h1>Legend</h1>"];
//     for (let category of categories) {
//         legendInfo.push(`<ul>${category}</ul>`)
//     }

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " +  + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding the legend to the map
//   legend.addTo(myMap);