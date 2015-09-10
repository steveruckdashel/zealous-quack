import React from "react";
import Greeting from "./greeting.jsx";
import User from "./user.jsx";
//var FixedDataTable = require('fixed-data-table');

React.render(
  <Greeting name="World"/>,
  document.getElementById('content')
);

React.render(
  <User url="/yahoo/users/" pollInterval={31000} />,
  document.getElementById('user')
)
