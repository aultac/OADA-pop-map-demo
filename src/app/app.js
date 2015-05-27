var React = require('react');
var Table = require('../table/table.js');
var Map = require('../map/map.js');
var Promise = require('../../lib/bluebird.min.js');
var xhr = require('xhr-promise');

require('./app.css');

/* React App Container Component */
var AppContainer = React.createClass ({

  // In this incarnation (Proof-Of-Concept 1), many things are hard-coded
  getInitialState: function() {
    var ret = {
      auth: { header: "Bearer SJKF9jf309" },
      logged_in_user: { name: "Frank" }, // Hardcoded for now
      oada_domain: { oada_base_uri: null }, 
      cur_rx: require('../orx/Ault_Farms_Keim_60.orx.js'), // Hardcoded for now
    };
    return ret;
  },
     
  tableValueChanged: function(zone, updatedValue) {
    var new_rx = this.state.cur_rx;
    console.log('zone ' + zone + ' changed.  new value = ', updatedValue);
    new_rx.zones[zone].population.value = updatedValue;
    this.setState({
      cur_rx: new_rx
    });
  },
      
  render: function () {
    return (
      <div>
        <div className="map">
          <Map ref='myMap' data={this.state.cur_rx} />
        </div>
        //<div className="table">
        //  <Table ref='myTable' data={this.state.cur_rx} onTableChange={this.tableValueChanged}/>
        //</div>
      </div>
    );
  },
});


React.render(
  <AppContainer />,
  document.getElementById('app-container')
);


