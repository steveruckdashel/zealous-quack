import React from "react";

export default React.createClass({
  loadGameFromServer: function() {
    $http("/yahoo/users/leagues/{this.props.data}/standings")
      .get({})
      .then(function(data) {
        this.setState({data: JSON.parse(data)});
      }.bind(this))
      .catch(function(xhr, status, err) {
        console.error(this.props.url, status, err);
      }.bind(this));
  },
  getInitialState: function() {
    return {data: {
    }};
  },
  componentDidMount: function() {
    this.loadGameFromServer();
    setInterval(this.loadUserFromServer, this.props.pollInterval);
  },
  render: function() {
    var str = JSON.stringify(this.state.data)
    return (
      <div className="standings">
        <pre>{str}</pre>
      </div>
    );
  },
});
