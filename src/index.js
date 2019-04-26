import React from 'react';
import ReactDOM from 'react-dom';

import App from './Components/App/App';
import Login from './Components/Login/Login';
import Callback from './Components/Callback/Callback';


import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import './index.css';

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/callback" component={Callback} />
        <Route exact path="/player" component={App} />
        <Route component={() => <Redirect to="/login" />} />
      </Switch>
    </div>
  </Router>
)


ReactDOM.render(routing, document.getElementById('root'));

