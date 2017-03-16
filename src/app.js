const ScatterChart =  require('./components/scatter_chart')
const d3 = require("d3");

const height = 600;
const width = 1000;
const padding = 60;

const svg = d3.select("#pokemonVisualization");
const dataSource = svg.attr('data-source');

d3.csv(dataSource, function(error, rawData) {
  if (error) throw error;

  var data = rawData.map(function(element){
    element.MATCHED = true;
    return element;
  });

  document.getElementById("pokemonSearch").focus();

  var scatterChart = new ScatterChart(svg, data, height, width - 10, padding);

  d3.select('#pokemonSearch')
    .on('input', function(e) {
      var searchValue = this.value;
      scatterChart.highlight(searchValue);
    });

  var axisVertical = d3.axisLeft(scatterChart.hpScale).ticks(5);
  svg.append('g').attr('transform','translate(' + padding + ', 0)').call(axisVertical);
  svg.append('text')
    .attr('x', 15)
    .attr('y', 50)
    .attr('font-family', 'verdana')
    .attr('font-size', '14px')
    .text('HP×DEF');

  var axisHorizontal = d3.axisBottom(scatterChart.cpScale).ticks(10);
  svg.append('g').attr('transform','translate(0,' + (height-padding) + ')').call(axisHorizontal);
  svg.append('text')
    .attr('x', width - 80)
    .attr('y', height - 40)
    .attr('font-family', 'verdana')
    .attr('font-size', '14px')
    .text('CP');
});
