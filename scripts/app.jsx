import React from "react";
import Menu from "./menu.jsx"
import Body from "./body.jsx"
//var FixedDataTable = require('fixed-data-table');

let App = React.createClass({
    render: function () {
        return (
          <div className="slds-grid slds-wrap">
            <Menu />
            <Body />
          </div>
        );
    }
});

React.render(
  <App />,
  document.body
);
