import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Dashboard } from './containers/Dashboard';
import { Space, NewSpace } from './containers/Spaces';

export const Router = () => (
  <BrowserRouter>
    <Route path="/" component={App} />
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route path='/spaces'>
        <Switch>
          <Route path='/spaces/new' component={NewSpace} />
          <Route path='/spaces/:id' component={Space} />
        </Switch>
      </Route>
    </Switch>
  </BrowserRouter>
);