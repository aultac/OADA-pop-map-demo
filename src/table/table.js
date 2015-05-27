var React = require('react');
var ZoneTableRow = require('./zonestablerow.js');
var _ = require('lodash');

require('./table.css');

/* Table React Component */
module.exports = React.createClass({
  onTableChange: function(zone, updatedPopulation) {
    this.props.onTableChange(zone, updatedPopulation);
  },
  
  render: function() {
    var orxData = this.props.data;
    var zones = [];
    var length = _.size(orxData.zones);
    for(i = 0; i < length; i++) {
      var name = _.keys(orxData.zones)[i];
      var population = orxData.zones[name].population.value;
      zones[i] = {name, population};
    }
    
    var rows = [];
    
    zones.forEach(function(zone) {
        rows.push(<ZoneTableRow Zone={zone.name} Population={zone.population} key={zone.name} onRowChange={this.onTableChange}/>);
    }.bind(this));
    
    return (
      <table id="zonestable">
        <tr>
          <th>Zone</th>
          <th>Population</th>
        </tr>
        {rows}
      </table>
    );
  }
});
  

