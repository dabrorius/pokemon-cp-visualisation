class DetailsView {
  constructor(parent) {
    this.root = parent.append('g');
    this.root.append('rect')
      .attr('x', 5)
      .attr('y', 5)
      .attr('height', 50)
      .attr('width', 50);
  }

  _createLabel() {

  }
}

module.exports = DetailsView;
