import React from "react";
import League from "./league.jsx";

export default React.createClass({
  loadGameFromServer: function() {
    $http("/yahoo/users/game/{this.props.data}")
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
      Users: [],
    }};
  },
  componentDidMount: function() {
    this.loadGameFromServer();
    setInterval(this.loadUserFromServer, this.props.pollInterval);
  },
  render: function() {
    var gameNodes = this.state.data.Users.map(function(user) {
      users.Games.filter(function(game) { return game.Game_id == 348; }).map(function (game) {
        games.Leagues.map(function (league) {
          return (
            <League data="{league.LeagueKey}" />
          );
        });
      });
    });

    return (
      <div className="game">
      {gameNodes}
      </div>
    );
  },
});
