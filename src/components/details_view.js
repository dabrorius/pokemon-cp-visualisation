const StatsBar = require('./stats_bar');
const d3 = require('d3');

class DetailsView {
  constructor(x, y, data, parent) {
    const labelPadding = 2;
    const barYPositions = d3.scaleBand()
      .domain(d3.range(5))
      .rangeRound([50, 200]);

    this.root = parent.append('g').attr('transform', `translate(${x},${y})`);

    this.pokemonName = this.root.append('text')
      .attr('x', 0)
      .attr('y', 16)
      .attr('font-family', 'verdana')
      .attr('font-size', '16px');

    const maxCP = d3.max(data, function(e) { return parseInt(e['MAX_CP_40']) });
    this.cpBar = new StatsBar(0, barYPositions(0), maxCP, '#35ADC5', this.root);

    const maxHP = d3.max(data, function(e) { return parseInt(e['MAX_HP_40']) });
    this.hpBar = new StatsBar(0, barYPositions(1), maxHP, '#B3D5D6', this.root);

    const maxATK = d3.max(data, function(e) { return parseInt(e['ATK']) });
    this.attackBar = new StatsBar(0, barYPositions(2), maxATK, '#B69689', this.root);

    const maxDEF = d3.max(data, function(e) { return parseInt(e['DEF']) });
    this.defenseBar = new StatsBar(0, barYPositions(3), maxDEF, '#D7B19C', this.root);

    const maxSTA = d3.max(data, function(e) { return parseInt(e['STA']) });
    this.staminaBar = new StatsBar(0, barYPositions(4), maxSTA, '#E5D1B9', this.root);
  }

  update(name, cp, hp, atk, def, sta) {
    this.pokemonName.text(name);
    this.cpBar.update(cp, 'CP');
    this.hpBar.update(hp, 'HP');
    this.attackBar.update(atk, 'ATK');
    this.defenseBar.update(def, 'DEF');
    this.staminaBar.update(sta, 'STA');
  }

  hide() {
    this.root.attr('visibility', 'hidden');
  }

  show() {
    this.root.attr('visibility', 'visible');
  }
}

module.exports = DetailsView;
