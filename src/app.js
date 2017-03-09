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

var searchMatchRadiusScale = d3.scaleOrdinal()
  .domain([true, false])
  .range([6, 3]);

var searchMatchOpacityScale = d3.scaleOrdinal()
  .domain([true, false])
  .range([1, 0.2]);

var barLength = 100;
var cpBarScale = d3.scaleLinear().domain([0, 3670]).range([0, barLength]);
var hpBarScale = d3.scaleLinear().domain([0, 415]).range([0, barLength]);
var attackScale = d3.scaleLinear().domain([0, 330]).range([0, barLength]);
var defenseScale = d3.scaleLinear().domain([0, 396]).range([0, barLength]);
var staminaScale = d3.scaleLinear().domain([0, 510]).range([0, barLength]);

d3.csv("pokemon.csv", function(error, rawData) {
  if (error) throw error;

  var data = rawData.map(function(element){
    element.MATCHED = true;
    return element;
  });
  console.log(data);

  var svg = d3.select("svg");

  var detailsScreen = svg.append('g');
  var pokemonName = detailsScreen.append('text')
    .attr('x', 50)
    .attr('y', 50)
    .attr('font-family', 'verdana')
    .attr('font-size', '16px');

  var barHeight =  8;
  var barXPos = 50;
  var barYPos = 80;
  var barPadding = 20;
  var labelPadding = 2;

  var labelXPos = 50;

  var createBar = function(x, y, fill) {
    detailsScreen.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('height', barHeight)
      .attr('fill', '#eee')
      .attr('width', barLength);

    return detailsScreen.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('height', barHeight)
      .attr('fill', fill)
      .attr('width', 0);
  }

  var cpBar = createBar(barXPos, barYPos, '#35ADC5');
  var hpBar = createBar(barXPos, barYPos + (barHeight + barPadding), '#B3D5D6');
  var attackBar = createBar(barXPos, barYPos + (barHeight + barPadding) * 2, '#B69689');
  var defenseBar = createBar(barXPos, barYPos + (barHeight + barPadding) * 3, '#D7B19C');
  var staminaBar = createBar(barXPos, barYPos + (barHeight + barPadding) * 4, '#E5D1B9');

  var createLabel = function(x, y) {
    return detailsScreen.append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('font-family', 'verdana')
      .attr('font-size', '10px');
  }

  var cpLabel = createLabel(labelXPos, barYPos - labelPadding);
  var hpLabel = createLabel(labelXPos, barYPos - labelPadding + (barHeight + barPadding));
  var attackLabel = createLabel(labelXPos, barYPos - labelPadding + (barHeight + barPadding) * 2);
  var defenseLabel = createLabel(labelXPos, barYPos - labelPadding + (barHeight + barPadding) * 3);
  var staminaLabel = createLabel(labelXPos, barYPos - labelPadding + (barHeight + barPadding) * 4);

  var circlesGroup = svg.append('g');
  circlesGroup.selectAll('circle').data(data).enter()
    .append('circle')
    .attr('cx', function(d) { return cpScale(d['MAX_CP_40']); })
    .attr('cy', function(d) { return hpScale(d['MAX_HP_40']); })
    .attr('fill', function(d) { return typeScale(d['TYPE1']); })
    .attr('r', 6)
    .on('mouseover', function(d) {
      if( d['MATCHED'] ) {
        pokemonName.text(d['NAME']);
        d3.select(this).attr('style', 'stroke:#555;stroke-width:3px;');
        cpLabel.text(d['MAX_CP_40'] + ' CP');
        hpLabel.text(d['MAX_HP_40'] + ' HP');
        attackLabel.text(d['ATK'] + ' ATK');
        defenseLabel.text(d['DEF'] + ' DEF');
        staminaLabel.text(d['STA'] + ' STA');
        cpBar.transition().attr('width', cpBarScale(d['MAX_CP_40']));
        hpBar.transition().attr('width', hpBarScale(d['MAX_HP_40']));
        attackBar.transition().attr('width', attackScale(d['ATK']));
        defenseBar.transition().attr('width', defenseScale(d['DEF']));
        staminaBar.transition().attr('width', staminaScale(d['STA']));
      }
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('style', null);
    });


  d3.select('#pokemonSearch')
    .on('input', function(e) {
      var searchValue = this.value;
      console.log(searchValue);
      pokemonName.text(null);
      cpLabel.text(null);
      hpLabel.text(null);
      attackLabel.text(null);
      defenseLabel.text(null);
      staminaLabel.text(null);
      cpBar.transition().attr('width', 0);
      hpBar.transition().attr('width', 0);
      attackBar.transition().attr('width', 0);
      defenseBar.transition().attr('width', 0);
      staminaBar.transition().attr('width', 0);
      data.forEach(function(element) {
        if(element['NAME'].toLowerCase().includes(searchValue) || searchValue.length < 3) {
          element.MATCHED = true;
        } else {
          element.MATCHED = false;
        }
      });
      circlesGroup.selectAll('circle').data(data)
        .transition()
        .attr('r', function(d) { return searchMatchRadiusScale(d['MATCHED']) } )
        .attr('fill-opacity', function(d) { return searchMatchOpacityScale(d['MATCHED']) } )
    });

  var axisVertical = d3.axisLeft(hpScale).ticks(5);
  svg.append('g').attr('transform','translate(' + padding + ', 0)').call(axisVertical);

  var axisHorizontal = d3.axisBottom(cpScale).ticks(10);
  svg.append('g').attr('transform','translate(0,' + (height-padding) + ')').call(axisHorizontal);
});
