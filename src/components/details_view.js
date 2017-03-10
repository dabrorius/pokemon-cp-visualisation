import StatsBar from './stats_bar'

class DetailsView {
  constructor(x, y, parent) {
    this.d3 = require("d3");
    this.root = parent.append('g').attr('transform', `translate(${x},${y})`);

    this.pokemonName = this.root.append('text')
      .attr('x', 0)
      .attr('y', 16)
      .attr('font-family', 'verdana')
      .attr('font-size', '16px');

    this.barLength = 100;
    this.barHeight =  8;

    const labelPadding = 2;

    const barYPositions = this.d3.scaleBand()
      .domain(this.d3.range(5))
      .rangeRound([50, 200]);

    this.cpBar = new StatsBar(0, barYPositions(0), 3670, '#35ADC5', this.root);
    this.hpBar = new StatsBar(0, barYPositions(1), 415, '#B3D5D6', this.root);
    this.attackBar = new StatsBar(0, barYPositions(2), 330, '#B69689', this.root);
    this.defenseBar = new StatsBar(0, barYPositions(3), 396, '#D7B19C', this.root);
    this.staminaBar = new StatsBar(0, barYPositions(4), 510, '#E5D1B9', this.root);
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
