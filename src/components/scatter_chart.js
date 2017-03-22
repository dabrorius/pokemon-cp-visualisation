const d3 = require('d3');
const DetailsView = require('./details_view');

class ScatterChart {
  constructor(root, data, options) {
    this.root = root;
    this.data = data;

    this.sizeSettings = {width: 500, height: 500, padding: 60}
    let sizeSettings = this.sizeSettings;
    Object.assign(this.sizeSettings, options);

    this.verticalDomain = 'STA';
    var verticalDomain = this.verticalDomain;

    this.horizontalDomain = 'MAX_CP_40';
    var horizontalDomain = this.horizontalDomain;

    this.horizontalScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(e) { return parseInt(e[horizontalDomain]); })])
      .range([sizeSettings.padding, sizeSettings.width-sizeSettings.padding]);

    this.verticalScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(e) { return (parseInt(e[verticalDomain])); })])
      .range([sizeSettings.height-sizeSettings.padding, sizeSettings.padding]);

    this.typeScale = d3.scaleOrdinal()
      .domain(['Normal', 'Fire', 'Fighting', 'Water', 'Flying', 'Grass', 'Poison', 'Electric', 'Ground', 'Psychic', 'Rock', 'Ice', 'Bug', 'Dragon', 'Ghost', 'Dark', 'Steel', 'Fairy'])
      .range(['#A8A878', '#F08030', '#C03028', '#6890F0', '#A890F0', '#78C850', '#A040A0', '#F8D030', '#E0C068', '#F85888', '#B8A038', '#98D8D8', '#A8B820', '#7038F8', '#705898', '#705848', '#B8B8D0', '#EE99AC']);

    this.detailsView = new DetailsView(70, 55, data, this.root);
    this.detailsView.hide();

    this.pointsGroup = this.root.append('g');
    this._drawPoints();

    this.labelsGroup = this.root.append('g');
    this._drawLabels();
  }

  updateVerticalDomain(newDomain) {
    this.verticalDomain = newDomain;
    this.verticalScale.domain([0, d3.max(this.data, function(e) { return (parseInt(e[newDomain])); })]);
    this.pointsGroup.selectAll('circle').data(this.data, this._dataKey)
      .transition()
      .duration(1000)
      .attr('cy', (d) => { return this.verticalScale(d[newDomain]); });
    this.labelsGroup.selectAll('text').data(this.data, this._dataKey)
      .transition()
      .duration(1000)
      .attr('y', (d) => { return this.verticalScale(d[newDomain]) + 8; })
  }

  updateHorizontalDomain(newDomain) {
    this.verticalDomain = newDomain;
    this.horizontalScale.domain([0, d3.max(this.data, function(e) { return (parseInt(e[newDomain])); })]);
    this.pointsGroup.selectAll('circle').data(this.data, this._dataKey)
      .transition()
      .duration(1000)
      .attr('cx', (d) => { return this.horizontalScale(d[newDomain]); });
    this.labelsGroup.selectAll('text').data(this.data, this._dataKey)
      .transition()
      .duration(1000)
      .attr('x', (d) => { return this.horizontalScale(d[newDomain]) + 8; })
  }

  updateWidth(newWidth) {
    this.horizontalScale.range([this.sizeSettings.padding, newWidth - this.sizeSettings.padding]);
    this.pointsGroup.selectAll('circle').data(this.data, this._dataKey)
      .attr('cx', (d) => { return this.horizontalScale(d[horizontalDomain]); });
    this.labelsGroup.selectAll('text').data(this.data, this._dataKey)
      .attr('x', (d) => { return this.horizontalScale(d[horizontalDomain]) + 8; })
  }

  verticalScale() {
    return this.verticalScale;
  }

  horizontalScale() {
    return this.horizontalScale;
  }

  highlight(name) {
    var verticalDomain = this.verticalDomain;

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
      this.detailsView.update(matchedElements[0]['NAME'], matchedElements[0][horizontalDomain], matchedElements[0][verticalDomain], matchedElements[0]['ATK'], matchedElements[0]['DEF'], matchedElements[0]['STA']);
    }

    matchedElements.forEach((e) => {
      let circle = document.getElementById(`CIRCLE-${e.ID}`);
      circle.parentNode.appendChild(circle);
    });


    this.pointsGroup.selectAll('circle').data(this.data, this._dataKey )
      .transition()
      .attr('r', function(d) { return d['MATCHED'] ? 6 : 3 } )
      .attr('fill-opacity', function(d) { return d['MATCHED'] ? 1 : 0.2 } )
      .attr('style', null);
    this.labelsGroup.selectAll('text').data(this.data)
      .attr('visibility', function(d) { return (d['MATCHED'] && name.length >= 3) ? 'visible' : 'hidden' } );
  }

  _drawPoints() {
    var chart = this;
    var root = this.root;
    var verticalDomain = this.verticalDomain;
    var horizontalDomain = this.horizontalDomain;

    this.pointsGroup.selectAll('circle').data(this.data, this._dataKey).enter()
      .append('circle')
      .attr('id', (d) => { return `CIRCLE-${d['ID']}`; })
      .attr('cx', (d) => { return this.horizontalScale(d[horizontalDomain]); })
      .attr('cy', (d) => { return this.verticalScale(d[verticalDomain]); })
      .attr('fill', (d) => { return this.typeScale(d['TYPE1']); })
      .attr('r', 6)
      .on('mouseover', function(d) {
        if( d['MATCHED'] ) {
          d3.select(this).attr('style', 'stroke:#666;stroke-width:2px;');
          this.parentNode.appendChild(this);
          root.select(`#LABEL-${d['ID']}`).attr('visibility', 'visible');
        }
      })
      .on('mouseout', function(d) {
        d3.select(this).attr('style', null);
        root.select(`#LABEL-${d['ID']}`).attr('visibility', 'hidden');
      })
      .on('click', function(d) {
        chart.detailsView.show();
        chart.detailsView.update(d['NAME'], d[horizontalDomain], d[verticalDomain], d['ATK'], d['DEF'], d['STA']);
        document.getElementById("pokemonSearch").focus();
      });
  }

  _drawLabels() {
    var verticalDomain = this.verticalDomain;
    var horizontalDomain = this.horizontalDomain;

    this.labelsGroup.selectAll('text').data(this.data, this._dataKey).enter()
      .append('text')
      .attr('id', (d) => { return `LABEL-${d['ID']}`; })
      .attr('x', (d) => { return this.horizontalScale(d[horizontalDomain]) + 8; })
      .attr('y', (d) => { return this.verticalScale(d[verticalDomain]) + 4; })
      .attr('font-family', 'verdana')
      .attr('font-size', '10px')
      .attr('visibility', 'hidden')
      .text(function(d) { return d['NAME']; });
  }

  _dataKey(e) {
    return e.ID;
  }
}

module.exports = ScatterChart;
