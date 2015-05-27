var React = require('react');
var Table = require('../table/table.js');
var Map = require('../map/map.js');
var Navbar = require('../navbar/navbar.js');
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
      oada_domain: null,
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

  OADADomainChanged: function(new_domain) {
    this.setState({
      oada_domain: new_domain,
    });
  },

  sendRx: function() {
    // get well-known, 
    // figure out oada_base_uri, 
    // POST to /resources, 
    // then POST to /bookmarks/planting/prescriptions/list
    console.log("you need to write sendRx");
  },
      
  render: function () {
    return (
      <div>
        <Navbar ref='myNav' onOADADomainChange={this.OADADomainChanged} onSendRx={this.onSendRx} />
        <Map ref='myMap' data={this.state.cur_rx} />
        <Table ref='myTable' data={this.state.cur_rx} onTableChange={this.tableValueChanged}/>

      </div>
    );
  },
});

React.render(
  <AppContainer />,
  document.getElementById('app-container')
);


