import ScatterChart from './components/scatter_chart'

var d3 = require("d3");
var height = 600;
var width = 1000;
var padding = 40;

var svg = d3.select("#pokemonVisualization");

d3.csv(svg.attr('data-source'), function(error, rawData) {
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
    .attr('x', 20)
    .attr('y', 30)
    .attr('font-family', 'verdana')
    .attr('font-size', '14px')
    .text('HP');

  var axisHorizontal = d3.axisBottom(scatterChart.cpScale).ticks(10);
  svg.append('g').attr('transform','translate(0,' + (height-padding) + ')').call(axisHorizontal);
  svg.append('text')
    .attr('x', width - 50)
    .attr('y', height - 10)
    .attr('font-family', 'verdana')
    .attr('font-size', '14px')
    .text('CP');

});
