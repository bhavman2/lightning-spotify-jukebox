import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

const queryString = require('query-string');

class Callback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      access_token: '',
      refresh_token: '',
      searchResults: []
    }
  }

  componentDidMount = () => {
    this.handleToken();
  }

  handleToken = () => {
    const { access_token, refresh_token } = queryString.parse(this.props.location.search);
    if (access_token && refresh_token) {
      this.setState({
        access_token,
        refresh_token,
        loggedIn: true
      });
    } else {
      console.log('No access token present, try logging in again.')
    }
  }

  render = () => {
    if (this.state.loggedIn) {
      return <Redirect to={{
        pathname: '/player',
        state: {
          loggedIn: this.state.loggedIn,
          access_token: this.state.access_token,
          refresh_token: this.state.refresh_token
        }
      }}
      />
    }
    return (
      <div>
        <Spinner animation="border" role="status" >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }
}

export default Callback;