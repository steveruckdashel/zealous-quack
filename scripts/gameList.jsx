import React from "react";

export default React.createClass({
  render: function() {
    var gameNodes = this.props.data.map(function(game){
      return (
          <div>
            <span>{game.Type}</span>
            <span>{game.Season}</span>
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
