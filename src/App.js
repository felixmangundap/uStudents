import React, { Component, Fragment } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import PersonalInfo from './pages/PersonalInfo';
import Dashboard from './pages/Dashboard';
import Personal from './pages/Personal';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { auth, firestore } from './services/firebase';
import './styles.css';

const PrivateRoute = ({
  component: Component,
  authenticated,
  infoSetup,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (authenticated === true) {
        return infoSetup ? (
          <Component {...props} />
        ) : (
          <Redirect to="/add-personal-information" />
        );
      } else
        return (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        );
    }}
  />
);

const InfoSetupRoute = ({
  component: Component,
  authenticated,
  infoSetup,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (authenticated === true) {
        return infoSetup ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        );
      } else
        return (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        );
    }}
  />
);

const PublicRoute = ({
  component: Component,
  authenticated,
  infoSetup,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (authenticated === true) {
        return infoSetup ? (
          <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/add-personal-information" />
        );
      } else return <Component {...props} />;
    }}
  />
);

class App extends Component {
  state = {
    authenticated: false,
    infoSetup: false,
    loading: true,
  };

  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection('users')
          .doc(user.uid)
          .onSnapshot((snapshot) => {
            if (snapshot.data()) {
              const infoSetup = snapshot.data().infoSetup;
              this.setState({ infoSetup }, () => {
                this.setState({
                  authenticated: true,
                  loading: false,
                });
              });
            }
          });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    });
  }

  render() {
    return this.state.loading === true ? (
      <h2>Loading...</h2>
    ) : (
      <Provider store={store}>
        <Router>
          <Fragment>
            <NavBar authenticated={this.state.authenticated} />
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <PrivateRoute
                path="/dashboard"
                authenticated={this.state.authenticated}
                infoSetup={this.state.infoSetup}
                component={Dashboard}
              ></PrivateRoute>
              <PrivateRoute
                path="/personal"
                authenticated={this.state.authenticated}
                infoSetup={this.state.infoSetup}
                component={Personal}
              ></PrivateRoute>
              <InfoSetupRoute
                path="/add-personal-information"
                authenticated={this.state.authenticated}
                infoSetup={this.state.infoSetup}
                component={PersonalInfo}
              ></InfoSetupRoute>
              <PublicRoute
                path="/signup"
                authenticated={this.state.authenticated}
                infoSetup={this.state.infoSetup}
                component={Signup}
              ></PublicRoute>
              <PublicRoute
                path="/login"
                authenticated={this.state.authenticated}
                infoSetup={this.state.infoSetup}
                component={Login}
              ></PublicRoute>
            </Switch>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
