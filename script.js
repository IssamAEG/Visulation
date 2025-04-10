// Dimensions du graphique
const width = 960;
const height = 600;

// Création de la carte avec D3.js
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Projection et path pour la carte
const projection = d3.geoNaturalEarth1()
    .scale(160)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Charger les données géographiques (GeoJSON)
d3.json("data/custom.geo.json").then(function(geoData) {

    // Charger les données des attaques numériques
    d3.csv("data/attacks_data.csv").then(function(data) {

        // Préparer les données des attaques par pays
        const attackData = {};
        data.forEach(function(d) {
            if (!attackData[d.country]) {
                attackData[d.country] = [];
            }
            attackData[d.country].push({
                type: d.attack_type,
                count: +d.count
            });
        });
        // Créer la carte avec les pays
        svg.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#ccc")
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .attr("class", "country")
            .on("click", function(event, d) {
                displayCountryInfo(d.properties.name);
            })
            .attr("title", function(d) { return d.properties.name; })  // Ajouter le nom du pays au survol

        // Fonction pour afficher les attaques lorsqu'un pays est cliqué
        function displayCountryInfo(countryName) {
            // Vérification de la correspondance du pays
            countryName = countryName.trim();  // Assurer une correspondance sans espaces supplémentaires
            const attacks = attackData[countryName] || [];

            // Si le pays existe dans les données
            if (attacks.length > 0) {
                const attackText = attacks.map(function(d) {
                    const total = d3.sum(attacks, function(t) { return t.count; });
                    const percentage = (d.count / total * 100).toFixed(2);
                    return `<p><strong>${d.type}</strong>: ${percentage}%</p>`;
                }).join('');
                d3.select("#info")
                    .html(`<h2>Attaques numériques en ${countryName}</h2>${attackText}`)
                    .style("display", "block");
            } else {
                d3.select("#info")
                    .html(`<h2>Aucune donnée disponible pour ${countryName}</h2>`)
                    .style("display", "block");
            }
        }

    });
});
