var React = require('react');

require('./navbar.css');

module.exports = React.createClass({
  getDefaultProps: function() {
    return {
      onOADADomainChange: null,
      onSendRx: null,
      sendState: '',
    };
  },

  onOADADomainChange: function(new_domain_evt) {
    this.props.onOADADomainChange(new_domain_evt);
  },
  onSendRx: function() {
    this.props.onSendRx();
  },

  render: function() {
    var self = this;
    var sendstate_class = 'sendstate_default';
    if (self.props.sendState.match(/Success/)) {
      sendstate_class = 'sendstate_success';
    } else if (self.props.sendState.match(/Fail/)) {
      sendstate_class = 'sendstate_fail';
    }
    return (
      <div id="nav">
        <input name="oada_domain" onChange={self.onOADADomainChange} />
        <button name="send_rx" onClick={self.onSendRx}>Send RX</button>
        <span className={sendstate_class} id='sendState'>{self.props.sendState}</span>
      </div>
    );
  },
});
