import React from "react";

export default React.createClass({
  render: function() {
    var guidNodes = this.props.data.map(function(guid){
      return (
          <div key={guid}>
            <span>{guid}</span>
          </div>
      );
    });
    return (
      <div className="guidList">
        {guidNodes}
      </div>
    );
  },
});
