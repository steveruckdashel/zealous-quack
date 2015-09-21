import React from "react";
import * as http from "./http.js";

export default React.createClass({
  loadGameFromServer: function() {
    http.url(this.props.url)
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
    var leagueNodes = this.state.data.map(function (league) {
      return (
        <div key={league.LeagueID} className="league">
        <span>{this.props.data.Name}</span>
        <Scoreboard data="league.LeagueKey" />
        <Standings data="league.LeagueKey" />
        </div>
      )
    });

    return (
      <div>
        {leagueNodes}
      </div>
    );
  },
});
