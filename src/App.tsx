import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
import Register from './views/Register';
import Login from './views/Login';
import Home from './views/Home';
import UserContextProvider from './store/context/userContext/UserContextProvider';

const App: React.FC = (): JSX.Element => (
  <BrowserRouter>
    <Switch>
      <Route path="/register">
        <Register />
      </Route>
      <UserContextProvider>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
      </UserContextProvider>
    </Switch>
  </BrowserRouter>
);

export default App;
