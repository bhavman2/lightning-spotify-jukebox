import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import TrackTable from '../TrackTable/TrackTable';
import SearchBar from '../SearchBar/SearchBar';
import Navigation from '../Navigation/Navigation';
import NowPlaying from '../NowPlaying/NowPlaying';

import './App.css';

const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      redir: false,
      access_token: '',
      refresh_token: '',
      searchResults: []
    }
  }

  componentDidMount = () => {
    this.handleToken();
  }

  handleToken = () => {
    if (this.props.location.state) {
      const { loggedIn, access_token, refresh_token } = this.props.location.state;
      this.setState({
        loggedIn: loggedIn,
        access_token: access_token,
        refresh_token: refresh_token
      });
      spotifyApi.setAccessToken(access_token);
      spotifyApi.getMyDevices((err, data) => {
        console.log(data);
      });
    } else {
      this.setState({
        redir: true
      })
    }
  }

  logout = () => {
    this.setState({
      redir: true
    });
  }

  handleSearch = (searchTerm) => {
    spotifyApi.searchTracks(searchTerm, { limit: 10, explicit: false })
      .then((data) => {
        this.setState({
          searchResults: data.tracks.items
        });
        console.log('Artist albums', data.tracks.items);
      }, (err) => {
        console.error(err);
      });
  }

  playSong = (uri) => {
    spotifyApi.play({ "uris": [`${uri}`] })
      .then((data) => {
        console.log(data);
      }, (err) => {
        console.error(err);
      });
  }

  resumePlaylist = () => {
    spotifyApi.play({ "context_uri": "spotify:user:bhavman2:playlist:7DQ4HFrkRdsbvuC9Bcykdx", "device_id": "6c74fdde47da02cbb01554b03864b24e22f64b77" })
      .then((data) => {
        console.log(data);
      }, (err) => {
        console.error(err);
      });
  }

  render = () => {
    if (this.state.redir) {
      return <Redirect to='/login' />
    }
    return (
      <div className="App">
        <Navigation loggedIn={this.state.loggedIn} logout={this.logout} />
        <div>
          <div className="nowplaying-ctn">
            {this.state.loggedIn && <NowPlaying loggedIn={this.state.loggedIn} spotifyApi={spotifyApi} />}
          </div>
          <div className="search-ctn">
            <SearchBar handleSearch={this.handleSearch} />
          </div>
          <br />
          <div className="table-ctn">
            <TrackTable searchResults={this.state.searchResults} playSong={this.playSong} />
          </div>
        </div>

      </div>
    );
  }
}

export default App;
