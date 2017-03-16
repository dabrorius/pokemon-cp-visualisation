const d3 = require('d3');

class StatsBar {
  constructor(x, y, maxValue, fill, parent) {
    const options = { length: 100, height: 8, labelPadding: 2 }

    this.root = parent.append('g').attr('transform', `translate(${x},${y})`);
    this.scale = d3.scaleLinear().domain([0, maxValue]).range([0, options.length]);

    this.label = this.root.append('text')
      .attr('x', 0)
      .attr('y', - options.labelPadding)
      .attr('font-family', 'verdana')
      .attr('font-size', '10px');

    this.root.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', options.height)
      .attr('fill', '#eee')
      .attr('width', options.length);

    this.bar = this.root.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', options.height)
      .attr('fill', fill)
      .attr('width', 0);
  }

  update(value, unit) {
    this.label.text(`${value} ${unit}`);
    this.bar.transition().attr('width', this.scale(value));
  }
}

module.exports = StatsBar;
