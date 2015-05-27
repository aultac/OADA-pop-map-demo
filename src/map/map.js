var React = require('react');
var leaflet = require('leaflet');
var _ = require('lodash');

require('./map.css');

/* React Map component */
module.exports = React.createClass({
  createMap: function(element, geojson) {
    //TODO: Figure out what this is doing and setup with our own open street map
    var orx = this.props.data;
    var tiles = leaflet.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    var geomap = leaflet.geoJson(geojson, {
      //TODO: change the colors to be randomly separated and updated based on the # of features
      //TODO: Should change the feature properties to be the population and zone number -- show this in the pop-up instead of the "description"
      onEachFeature: function (feature, layer) {
        var zone = feature.properties.zone;
        var pop = orx.zones[zone].population.value;
        layer.bindPopup("zone: " + zone + " with pop: " + pop);
      }
    });
    map = leaflet.map(element);
    tiles.addTo(map);
    geomap.addTo(map);
    map.fitBounds(geomap.getBounds());
    return map;
  },

  getInitialState: function() {
    return null;
  },

  componentDidMount: function() {
    var geojson = _.get(this.props, 'data.geojson', null);

    if(this.props.createMap) {
      this.map = this.props.createMap(this.getDOMNode(), geojson);
    } else {
      this.map = this.createMap(this.getDOMNode(), geojson);
    }
  },

  render: function() {
    return (<div id="map"></div>);
  }
});

