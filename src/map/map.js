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
      attribution: 'Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
    });
    var geomap = leaflet.geoJson(geojson, {
      //TODO: Should change the feature properties to be the population and zone number -- show this in the pop-up instead of the "description"
      onEachFeature: function (feature, layer) {
        var zone = feature.properties.zone;
        var pop = orx.zones[zone].population.value;
        layer.bindPopup("zone: " + zone + " with pop: " + pop);
      },
      // TODO: This is pretty hacky. Auto generate colors from zone number ?
      style: function(feature) {
        var props = {};
        switch(feature.properties.zone) {
          case "default":
            props.color = '#FFA07A';
          break;

          case "1":
            props.color = '#FF8C00';
          break;

          case "2":
            props.color = '#87CEEB';
          break;

          case "3":
            props.color = '#008000';
          break;

          case "4":
            props.color = '#8B4513';
          break;

          case "5":
            props.color = '#8B0000';
          break;

          case "6":
            props.color = '#808080';
          break;
        }

        return props;
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

