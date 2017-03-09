class DetailsView {
  constructor(parent) {
    this.d3 = require("d3");
    this.root = parent.append('g');
    this.pokemonName = this.root.append('text')
      .attr('x', 50)
      .attr('y', 50)
      .attr('font-family', 'verdana')
      .attr('font-size', '16px');

    this.barLength = 100;
    this.barHeight =  8;

    var barXPos = 50;
    var barYPos = 80;
    var barPadding = 20;
    var labelPadding = 2;
    var labelXPos = 50;

    this.cpBar = this._createBar(barXPos, barYPos, '#35ADC5');
    this.hpBar = this._createBar(barXPos, barYPos + (this.barHeight + barPadding), '#B3D5D6');
    this.attackBar = this._createBar(barXPos, barYPos + (this.barHeight + barPadding) * 2, '#B69689');
    this.defenseBar = this._createBar(barXPos, barYPos + (this.barHeight + barPadding) * 3, '#D7B19C');
    this.staminaBar = this._createBar(barXPos, barYPos + (this.barHeight + barPadding) * 4, '#E5D1B9');

    this.cpLabel = this._createLabel(labelXPos, barYPos - labelPadding);
    this.hpLabel = this._createLabel(labelXPos, barYPos - labelPadding + (this.barHeight + barPadding));
    this.attackLabel = this._createLabel(labelXPos, barYPos - labelPadding + (this.barHeight + barPadding) * 2);
    this.defenseLabel = this._createLabel(labelXPos, barYPos - labelPadding + (this.barHeight + barPadding) * 3);
    this.staminaLabel = this._createLabel(labelXPos, barYPos - labelPadding + (this.barHeight + barPadding) * 4);

    this.cpBarScale = this.d3.scaleLinear().domain([0, 3670]).range([0, this.barLength]);
    this.hpBarScale = this.d3.scaleLinear().domain([0, 415]).range([0, this.barLength]);
    this.attackScale = this.d3.scaleLinear().domain([0, 330]).range([0, this.barLength]);
    this.defenseScale = this.d3.scaleLinear().domain([0, 396]).range([0, this.barLength]);
    this.staminaScale = this.d3.scaleLinear().domain([0, 510]).range([0, this.barLength]);
  }

  update(name, cp, hp, atk, def, sta) {
    this.pokemonName.text(name);
    this.cpLabel.text(`${cp} CP`);
    this.hpLabel.text(`${hp} HP`);
    this.attackLabel.text(`${atk} ATK`);
    this.defenseLabel.text(`${def} DEF`);
    this.staminaLabel.text(`${sta} STA`);
    this.cpBar.transition().attr('width', this.cpBarScale(cp));
    this.hpBar.transition().attr('width', this.hpBarScale(hp));
    this.attackBar.transition().attr('width', this.attackScale(atk));
    this.defenseBar.transition().attr('width', this.defenseScale(def));
    this.staminaBar.transition().attr('width', this.staminaScale(sta));
  }

  _createLabel(x, y) {
    return this.root.append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('font-family', 'verdana')
      .attr('font-size', '10px');
  }

  _createBar(x, y, fill) {
    this.root.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('height', this.barHeight)
      .attr('fill', '#eee')
      .attr('width', this.barLength);

    return this.root.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('height', this.barHeight)
      .attr('fill', fill)
      .attr('width', 0);
  }
}

module.exports = DetailsView;
