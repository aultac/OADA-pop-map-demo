var React = require('react');
var Table = require('../table/table.js');
var Map = require('../map/map.js');
var Navbar = require('../navbar/navbar.js');
var Promise = require('../../lib/bluebird.min.js');
var xhr_promise = require('xhr-promise');

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
      sendState: '',
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

  OADADomainChanged: function(evt) {
    this.setState({
      oada_domain: evt.target.value,
    });
  },

  sendRx: function() {
    var self = this;
    self.setState({ sendState: 'Sending...'});
    console.log('sendRx: domain is ', this.state.oada_domain);
    var domain = this.state.oada_domain;
    domain = domain || "";
    domain = domain.replace(/\/+$/,''); // no trailing slashes
    if (domain === 'oada-dev.com') {
      domain = 'http://52.4.148.83:3000';  // oada demo server
    }
    if (!domain.match(/^http/)) {
      domain = "https://"+domain
    }
    var oada_base_uri = "";
    return new xhr_promise().send({
      method: "GET",
      url: domain + "/.well-known/oada-configuration",
    }).then(function(res) {
      if (res.status !== 200)  {
        throw new Error('Failed to get well-known');
      }
      // Ignoring content-type for now
      console.log('sendRx: response after get well-known: ', res);
      var config_doc = JSON.parse(res.responseText);
      oada_base_uri = _.get(config_doc, "oada_base_uri", null);
      if (!oada_base_uri) 
        throw new Error('Failed to get OADA base URI');
      console.log('sendRx: oada_base_uri = ', oada_base_uri);

      // POST to /resources
      console.log("DON'T FORGET CONTENT TYPES ARE HARDCODED TO application/json!");
      var options = {
        method: 'POST',
        url: oada_base_uri + "/resources",
        headers: {
          'Content-type': 'application/vnd.oada.planting.prescription.1+json',
          'Authorization': self.state.auth.header,
        },
        data: JSON.stringify(self.state.cur_rx),
      };
      console.log('POST /resource: options = ', options);
      return new xhr_promise().send(options);
    }).then(function(res) {
      console.log('sendRx: response after POST /resources = ', res);
      if (res.status !== 200) {
        throw new Error('Unable to POST new prescription to '+oada_base_uri+'/resources');
      }
      console.log('Posted prescription, location = ', res.headers.location);
      // Now construct a link from this location and POST it to /bookmarks/planting/prescriptions/list
      var id = _.get(res, 'headers.location', '').replace(/^\/resources\//,'');
      var link = { _id: id, _rev: '0-0' }; 
      var options = {
        method: 'POST',
        url: oada_base_uri + "/bookmarks/planting/prescriptions/list",
        headers: {
          'Content-type': 'application/vnd.oada.planting.prescriptions.1+json',
          'Authorization': self.state.auth.header,
        },
        data: JSON.stringify(link),
      };
      console.log('sendRx: POSTing new link (',link,') to /bookmarks/planting/prescriptions.  options = ', options);
      return new xhr_promise().send(options);
    }).then(function(res) {
      console.log('Successfully POSTed prescription and link.  Link location = ', res.headers.location);
      self.setState({
        sendState: 'Sending...Success!'
      });
    }).catch(function(err) {
      self.setState({
        sendState: 'Sending...Failed.',
      });
      console.log('Failed in sendRx.  err = ', err);
    });
    // get well-known, 
    // figure out oada_base_uri, 
    // POST to /resources, 
    // then POST to /bookmarks/planting/prescriptions/list
    console.log("you need to write sendRx");
  },
      
  render: function () {
    return (
      <div>
        <Navbar ref='myNav' onOADADomainChange={this.OADADomainChanged} onSendRx={this.sendRx} sendState={this.state.sendState} />
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


