import React from 'react';
import { Router, Route } from 'dva/router';
import App from './App';
import About from './About';
import Container from './Container';

export const routes = (
  <Route path="" component={Container}>
    <Route path="/" namespace="user" component={App} />
    <Route path="/about" namespace="about" component={About} />
  </Route>
);

export default function({ history }) {
  return (
    <Router history={history}>
      { routes }
    </Router>
  );
}