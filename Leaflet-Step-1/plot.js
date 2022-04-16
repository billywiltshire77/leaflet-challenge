let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

d3.json(url).then((data) => {
    configureMap(data)
})

function configureMap(data) {
    console.log(data)

    earthquakeData = data.features
    maxDepth = data.bbox[5]
    numBins = [1, 2, 3, 4]
    depthBins = []

    for (let bin of numBins) {
        depthBins.push(maxDepth * (bin/numBins.length))
    }

    function markerSize(mag) {
        return Math.sqrt(mag) * 10000;
    }

    function onEachEarthquake(feature, layer) {
        
        quakeMarkers = []
        for (let quake of earthquakeData) {
        if (quake.geometry.coordinates[2] < depthBins[0]) {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                stroke: false,
                fillOpacity: 0.75,
                color: "black",
                fillColor: "green",
                radius: markerSize(quake.properties.mag)
                }).bindPopup(`<h3> ${quake.properties.title}</h3><hr><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>${quake.geometry.coordinates[2]} Meters Deep</p>`)
            );
        } else if (quake.geometry.coordinates[2] < depthBins[1]) {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "yellow",
                  radius: markerSize(quake.properties.mag)
                }).bindPopup(`<h3> ${quake.properties.title}</h3><hr><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>${quake.geometry.coordinates[2]} Meters Deep</p>`)
            );
        } else if (quake.geometry.coordinates[2] < depthBins[2]) {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "orange",
                  radius: markerSize(quake.properties.mag)
                }).bindPopup(`<h3> ${quake.properties.title}</h3><hr><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>${quake.geometry.coordinates[2]} Meters Deep</p>`)
            );
        } else {
            quakeMarkers.push(
                L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
                  stroke: false,
                  fillOpacity: 0.75,
                  color: "black",
                  fillColor: "red",
                  radius: markerSize(quake.properties.mag)
                }).bindPopup(`<h3> ${quake.properties.title}</h3><hr><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>${quake.properties.type}</p><p>Magnitude: ${quake.properties.mag}</p><p>${quake.geometry.coordinates[2]} Meters Deep</p>`)
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

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = depthBins;
        let colors = ["green", "yellow", "orange", "red"];
        let labels = [];

        // Add the minimum and maximum.
        let legendInfo = "<h1 class= \"text-center\">Meters Deep</h1>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

         limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
         });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    legend.addTo(myMap);
}