import React from "react";
import Game from "./game.jsx"

export default React.createClass({
  render: function() {
    var gameNodes = this.props.data.map(function(game){
      return (
          <div key={game.Game_id}>
            <span>{game.Type}</span>
            <span>{game.Season}</span>
            <span>{game.Game_key}</span>
            <Game data={game.Game_key} />
          </div>
      );
    });
    return (
      <div className="gameList">
        {gameNodes}
      </div>
    );
  },
});
