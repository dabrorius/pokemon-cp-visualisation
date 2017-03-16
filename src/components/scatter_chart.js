const d3 = require('d3');
const DetailsView = require('./details_view');

class ScatterChart {
  constructor(root, data, height, width, padding) {

    this.root = root;
    this.data = data;

    this.cpScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(e) { return parseInt(e['MAX_CP_40']); })])
      .range([padding, width-padding]);

    this.hpScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(e) { return (parseInt(e['MAX_HP_40']) * parseInt(e['DEF'])); })])
      .range([height-padding, padding]);

    this.typeScale = d3.scaleOrdinal()
      .domain(['Normal', 'Fire', 'Fighting', 'Water', 'Flying', 'Grass', 'Poison', 'Electric', 'Ground', 'Psychic', 'Rock', 'Ice', 'Bug', 'Dragon', 'Ghost', 'Dark', 'Steel', 'Fairy'])
      .range(['#A8A878', '#F08030', '#C03028', '#6890F0', '#A890F0', '#78C850', '#A040A0', '#F8D030', '#E0C068', '#F85888', '#B8A038', '#98D8D8', '#A8B820', '#7038F8', '#705898', '#705848', '#B8B8D0', '#EE99AC']);

    var detailsView = new DetailsView(70, 55, data, this.root);
    detailsView.hide();
    this.detailsView = detailsView;

    this.circlesGroup = this.root.append('g');

    this.circlesGroup.selectAll('circle').data(data, this._dataKey).enter()
      .append('circle')
      .attr('id', (d) => { return `CIRCLE-${d['ID']}`; })
      .attr('cx', (d) => { return this.cpScale(d['MAX_CP_40']); })
      .attr('cy', (d) => { return this.hpScale(d['MAX_HP_40'] * d['DEF']); })
      .attr('fill', (d) => { return this.typeScale(d['TYPE1']); })
      .attr('r', 6)
      .on('mouseover', function(d) {
        if( d['MATCHED'] ) {
          d3.select(this).attr('style', 'stroke:#666;stroke-width:2px;');
          detailsView.show();
          detailsView.update(d['NAME'], d['MAX_CP_40'], d['MAX_HP_40'], d['ATK'], d['DEF'], d['STA']);
          this.parentNode.appendChild(this);
        }
      })
      .on('mouseout', function(d) {
        d3.select(this).attr('style', null);
      })
      .on('click', function(d) {
        document.getElementById("pokemonSearch").focus();
      });

    this.labelsGroup = this.root.append('g');
    this.labelsGroup.selectAll('text').data(data, this._dataKey).enter()
      .append('text')
      .attr('x', (d) => { return this.cpScale(d['MAX_CP_40']) + 8; })
      .attr('y', (d) => { return this.hpScale(d['MAX_HP_40'] * d['DEF']) + 4; })
      .attr('font-family', 'verdana')
      .attr('font-size', '10px')
      .attr('visibility', 'hidden')
      .text(function(d) { return d['NAME']; });
  }

  hpScale() {
    return this.hpScale;
  }

  cpScale() {
    return this.cpScale;
  }

  highlight(name) {
    this.detailsView.hide();
    let matchedElements = [];
    this.data.forEach(function(element) {
      if(element['NAME'].toLowerCase().includes(name.toLowerCase()) || name.length < 3) {
        element.MATCHED = true;
        matchedElements.push(element);
      } else {
        element.MATCHED = false;
      }
    });
    if(matchedElements.length == 1) {
      this.detailsView.show();
      this.detailsView.update(matchedElements[0]['NAME'], matchedElements[0]['MAX_CP_40'], matchedElements[0]['MAX_HP_40'], matchedElements[0]['ATK'], matchedElements[0]['DEF'], matchedElements[0]['STA']);
    }

    matchedElements.forEach((e) => {
      let circle = document.getElementById(`CIRCLE-${e.ID}`);
      circle.parentNode.appendChild(circle);
    });


    this.circlesGroup.selectAll('circle').data(this.data, this._dataKey )
      .transition()
      .attr('r', function(d) { return d['MATCHED'] ? 6 : 3 } )
      .attr('fill-opacity', function(d) { return d['MATCHED'] ? 1 : 0.2 } )
      .attr('style', null);
    this.labelsGroup.selectAll('text').data(this.data)
      .attr('visibility', function(d) { return (d['MATCHED'] && name.length >= 3) ? 'visible' : 'hidden' } );
  }

  _dataKey(e) {
    return e.ID;
  }
}

module.exports = ScatterChart;
