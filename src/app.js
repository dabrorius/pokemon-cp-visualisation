import DetailsView from './components/details_view'

var d3 = require("d3");
var height = 600;
var width = 1000;
var padding = 40;

var cpScale = d3.scaleLinear()
  .domain([0, 3670])
  .range([padding, width-padding]);

var hpScale = d3.scaleLinear()
  .domain([0, 415])
  .range([height-padding, padding]);

var typeScale = d3.scaleOrdinal()
  .domain(['Normal', 'Fire', 'Fighting', 'Water', 'Flying', 'Grass', 'Poison', 'Electric', 'Ground', 'Psychic', 'Rock', 'Ice', 'Bug', 'Dragon', 'Ghost', 'Dark', 'Steel', 'Fairy'])
  .range(['#A8A878', '#F08030', '#C03028', '#6890F0', '#A890F0', '#78C850', '#A040A0', '#F8D030', '#E0C068', '#F85888', '#B8A038', '#98D8D8', '#A8B820', '#7038F8', '#705898', '#705848', '#B8B8D0', '#EE99AC']);

d3.csv("pokemon.csv", function(error, rawData) {
  if (error) throw error;
  var data = rawData.map(function(element){
    element.MATCHED = true;
    return element;
  });
  console.log(data);

  document.getElementById("pokemonSearch").focus();
  var svg = d3.select("svg");

  var detailsView = new DetailsView(50, 35, svg);
  detailsView.hide();

  var circlesGroup = svg.append('g');
  circlesGroup.selectAll('circle').data(data).enter()
    .append('circle')
    .attr('cx', function(d) { return cpScale(d['MAX_CP_40']); })
    .attr('cy', function(d) { return hpScale(d['MAX_HP_40']); })
    .attr('fill', function(d) { return typeScale(d['TYPE1']); })
    .attr('r', 6)
    .on('mouseover', function(d) {
      if( d['MATCHED'] ) {
        d3.select(this).attr('style', 'stroke:#555;stroke-width:3px;');
        detailsView.show();
        detailsView.update(d['NAME'], d['MAX_CP_40'], d['MAX_HP_40'], d['ATK'], d['DEF'], d['STA']);
      }
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('style', null);
    })
    .on('click', function(d) {
      document.getElementById("pokemonSearch").focus();
    });

  var labelsGroup = svg.append('g');
  labelsGroup.selectAll('text').data(data).enter()
    .append('text')
    .attr('x', function(d) { return cpScale(d['MAX_CP_40']) + 8; })
    .attr('y', function(d) { return hpScale(d['MAX_HP_40']) + 4; })
    .attr('font-family', 'verdana')
    .attr('font-size', '10px')
    .attr('visibility', 'hidden')
    .text(function(d) { return d['NAME']; });


  d3.select('#pokemonSearch')
    .on('input', function(e) {
      var searchValue = this.value;
      console.log(searchValue);
      detailsView.hide();
      let matchedElements = [];
      data.forEach(function(element) {
        if(element['NAME'].toLowerCase().includes(searchValue) || searchValue.length < 3) {
          element.MATCHED = true;
          matchedElements.push(element);
        } else {
          element.MATCHED = false;
        }
      });
      if(matchedElements.length == 1) {
        detailsView.show();
        detailsView.update(matchedElements[0]['NAME'], matchedElements[0]['MAX_CP_40'], matchedElements[0]['MAX_HP_40'], matchedElements[0]['ATK'], matchedElements[0]['DEF'], matchedElements[0]['STA']);
      }
      circlesGroup.selectAll('circle').data(data)
        .transition()
        .attr('r', function(d) { return d['MATCHED'] ? 6 : 3 } )
        .attr('fill-opacity', function(d) { return d['MATCHED'] ? 1 : 0.2 } )
      labelsGroup.selectAll('text').data(data)
        .attr('visibility', function(d) { return (d['MATCHED'] && searchValue.length >= 3) ? 'visible' : 'hidden' } );
    });

  var axisVertical = d3.axisLeft(hpScale).ticks(5);
  svg.append('g').attr('transform','translate(' + padding + ', 0)').call(axisVertical);
  svg.append('text')
    .attr('x', 20)
    .attr('y', 30)
    .attr('font-family', 'verdana')
    .attr('font-size', '14px')
    .text('HP');

  var axisHorizontal = d3.axisBottom(cpScale).ticks(10);
  svg.append('g').attr('transform','translate(0,' + (height-padding) + ')').call(axisHorizontal);
  svg.append('text')
    .attr('x', width - 50)
    .attr('y', height - 10)
    .attr('font-family', 'verdana')
    .attr('font-size', '14px')
    .text('CP');

});
