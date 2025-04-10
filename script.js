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