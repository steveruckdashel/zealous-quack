import React from "react";
import GameList from "./gameList.jsx";
import GuidList from "./guidList.jsx";
import * as http from "./http.js";

export default React.createClass({
  loadUserFromServer: function() {
    http.url("/yahoo/users/games")
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
      Users: [{
        Games:[],
        UserGuids:[],
      }],
    }};
  },
  componentDidMount: function() {
    this.loadUserFromServer();
    setInterval(this.loadUserFromServer, 31000);
  },
  render: function() {
    var i = 0;
    var userNodes = this.state.data.Users.map(function (user){
      return (
        <div key={i++}>
          <h1>User</h1>
          <GameList data={user.Games} />
          <GuidList data={user.UserGuids} />
        </div>
      );
    });

    return (
      <div className="user">
        {userNodes}
      </div>
    );
  },
});
