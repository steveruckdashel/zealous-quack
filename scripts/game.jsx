import React from "react";
import League from "./league.jsx";
import * as http from "./http.js"

export default React.createClass({
  loadGameFromServer: function() {
    http.url('/yahoo/users/game/' + this.props.data)
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
      Users: [],
    }};
  },
  componentDidMount: function() {
    this.loadGameFromServer();
    setInterval(this.loadUserFromServer, this.props.pollInterval);
  },
  render: function() {
    var gameNodes = this.state.data.Users.map(function(user) {
      user.Games.filter(function(game) { return game.Game_id == 348; }).map(function (game) {
        game.Leagues.map(function (league) {
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
