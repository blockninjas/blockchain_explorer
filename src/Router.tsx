import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Space } from './containers/Spaces/Space';
import { Dashboard } from './containers/Dashboard';

export const Router = () => (
  <BrowserRouter>
    <Route path="/" component={App} />
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route path='/spaces'>
        <Switch>
          <Route path='/spaces/:id' component={Space} />
        </Switch>
      </Route>
    </Switch>
  </BrowserRouter>
);