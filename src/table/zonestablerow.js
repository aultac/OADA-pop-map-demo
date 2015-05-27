var React = require('react');

require('./zonestablerow.css');

//NOTE: contentEditable is a HTML5 feature. This will require more code on older HTML versioned browsers
module.exports = React.createClass({
  
  onRowChange: function(e) {
    var zone = this.props.Zone;
    var updatedPop = e.target.value;
    this.props.onRowChange(zone, updatedPop);
  },
  
  render: function() {
    return (
        <tr>
          <td align="right" className="zonesTableCol" >{this.props.Zone}</td>
          <td align="left" className="zonesTableCol" ><input onChange={this.onRowChange} type="number" key={this.props.Zone} value={this.props.Population} /></td>
        </tr>
      );
  }
});
 
