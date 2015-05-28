var React = require('react');
var leaflet = require('leaflet');
var _ = require('lodash');
var chroma = require('chroma-js');

require('./map.css');

var feature_layers = [];

/* React Map component */
module.exports = React.createClass({
  createMap: function(element, geojson) {
    //TODO: Figure out what this is doing and setup with our own open street map
    var orx = this.props.data;
    var tiles = leaflet.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
      attribution: 'Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
    });

    //Setup a color scale for polygon colors
    var colorScale = chroma.scale(['white', 'green']);
    var minPop = _.min(orx.zones, function(zone){
        return zone.population.value;
      }).population.value;
    var maxPop = _.max(orx.zones, function(zone){
        return zone.population.value;
      }).population.value;
    var popRange = maxPop - minPop;

    var geomap = leaflet.geoJson(geojson, {
      //TODO: Should change the feature properties to be the population and zone number -- show this in the pop-up instead of the "description"
      onEachFeature: function (feature, layer) {
        var zone = feature.properties.zone;
        var pop = orx.zones[zone].population.value;
        feature_layers.push({ zone: zone, population: pop, layer: layer});
        layer.bindPopup("Zone: " + zone + " with Pop: " + pop);
      },
      // TODO: Recreate map with population zones change value.
      style: function(feature) {
        var props = {};
        //Get a value between 0-1 for the color scale
        var pop = orx.zones[feature.properties.zone].population.value;
        var colorValue = pop - minPop;
        if (colorValue != 0) {
          colorValue = colorValue / popRange; //0-1 range
        }
        props.color = colorScale(colorValue).brighten().hex();
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
    var self = this; 
    // Loop through all the zones on the map and see if popup needs to be updated:
    _.each(feature_layers, function(f) {
      var new_pop = _.get(self, 'props.data.zones['+f.zone+'].population.value');
      if (new_pop !== f.population) {
        console.log('Changing popup on zone ' + f.zone + ' from ' + f.population + ' to ' + new_pop);
        f.population = new_pop;
        f.layer.bindPopup("Zone: " + f.zone + " with Pop: " + f.population);
      }
    });
    return (<div id="map"></div>);
  },
});

