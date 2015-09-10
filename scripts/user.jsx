import React from "react";
import GameList from "./gameList.jsx";
import GuidList from "./guidList.jsx";
import $http from "./http.js";

export default React.createClass({
  loadCommentsFromServer: function() {
    $http(this.props.url)
      .get({})
      .then(function(data) {
        this.setState({data: JSON.parse(data)});
      }.bind(this))
      .catch(function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this));
  },
  getInitialState: function() {
    return {data: {
      UserGuids:[],
      Games:[],
    }};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="user">
        <h1>User</h1>
        <GameList data={this.state.data.Games} />
        <GuidList data={this.state.data.UserGuids} />
      </div>
    );
  },
});
