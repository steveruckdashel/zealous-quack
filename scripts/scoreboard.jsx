import React from "react";
import * as http from "./http.js";

export default React.createClass({
  loadGameFromServer: function() {
    http.url("/yahoo/users/leagues/"+{this.props.data}+"/scoreboard")
      .get({})
      .then(function(data) {
        this.setState({data: JSON.parse(data)});
      }.bind(this))
      .catch(function(xhr, status, err) {
        console.error(xhr, status, err);
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
      <div className="scoreboard">
        <pre>{str}</pre>
      </div>
    );
  },
});
