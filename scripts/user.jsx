import React from "react";
import GameList from "./gameList.jsx";
import GuidList from "./guidList.jsx";
import $http from "./http.js";

export default React.createClass({
  loadUserFromServer: function() {
    $http(this.props.url)
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
      Users: [{
        Games:[],
        UserGuids:[],
      }],
    }};
  },
  componentDidMount: function() {
    this.loadUserFromServer();
    setInterval(this.loadUserFromServer, this.props.pollInterval);
  },
  render: function() {
    var userNodes = this.state.data.Users.map(function (user){
      return (
        <div>
          <h1>User</h1>
          <GameList data={user.Games} />
          <GuidList data={user.UserGuids} />
        </div>
      );
    });

    return (
      <div className="users">
        {userNodes}
      </div>
    );
  },
});
