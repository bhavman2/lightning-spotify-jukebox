import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import TrackTable from './TrackTable/TrackTable';
import SearchBar from './SearchBar/SearchBar';
import Navigation from './Navigation/Navigation';
import NowPlaying from './NowPlaying/NowPlaying';
import Settings from './Settings/Settings';
import InvoiceModal from './Modal/InvoiceModal'
import axios from 'axios';
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
      searchResults: [],
      showSettings: false,
      device: {
        found: false,
        name: '',
        ID: ''
      },
      showQr: false,
      invoice: ''
    }
  }

  intervalDeviceID = 0;

  componentDidMount = () => {
    this.handleToken();
    this.getDevices();
    this.intervalDeviceID = setInterval(this.getDevices, 1000);
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalDeviceID);
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
    } else {
      this.setState({
        redir: true
      });
    }
  }

  getDevices = () => {
    spotifyApi.getMyDevices()
      .then((response) => {
        if (response.devices.length < 1) {
          this.setState({
            device: {
              found: false,
              name: '',
              ID: ''
            },
            showSettings: true
          });
        } else {
          this.setState({
            device: {
              found: true,
              name: response.devices[0].name,
              ID: response.devices[0].id
            }
          });
        }
      })
      .catch((err) => {
        console.log("Error getting devices")
      });
  }

  searchTracks = (searchTerm) => {
    spotifyApi.searchTracks(searchTerm, { limit: 15, explicit: false })
      .then((data) => {
        this.setState({
          searchResults: data.tracks.items
        });
      })
      .catch((err) => {
        console.log("Error searching tracks");
      });
  }

  playSong = (uri) => {
    spotifyApi.play({ "uris": [`${uri}`], "device_id": this.state.device.ID })
      .then((data) => {
        return;
      })
      .catch((err) => {
        console.log("Error playing song");
      });
  }

  waitForPayment = (invoiceId, uri) => {
    axios.get(
      `/fetchInvoice/${invoiceId}/wait`
    )
      .then((res) => {
        console.log('wait', res);
        this.playSong(uri);
      })
      .catch((err) => {
        console.log("Error getting payment status");
      });
  }

  generateInvoice = (uri) => {
    axios.post('/createInvoice')
      .then((res) => {
        console.log('post', res);
        this.setState({
          showQr: true,
          invoice: res.data.data.payreq
        });
        this.waitForPayment(res.data.data.id, uri);
      })
      .catch((err) => {
        console.log("Error getting invoice");
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

  closeSettings = () => this.setState({ showSettings: false });
  showSettings = () => this.setState({ showSettings: true });
  closeQr = () => this.setState({ showQr: false });
  logout = () => this.setState({ redir: true });

  render = () => {
    if (this.state.redir) {
      return <Redirect to='/login' />
    }
    return (
      <div className="App">
        <Settings
          showSettings={this.state.showSettings}
          handleCloseSettings={this.closeSettings}
          device={this.state.device}
          logout={this.logout} />
        <Navigation
          loggedIn={this.state.loggedIn}
          logout={this.logout}
          handleShowSettings={this.showSettings} />
        <div>
          <div className="nowplaying-ctn">
            {this.state.loggedIn &&
              <NowPlaying
                device={this.state.device.name}
                loggedIn={this.state.loggedIn}
                spotifyApi={spotifyApi} />}
          </div>
          <div className="search-ctn">
            <SearchBar
              handleSearch={this.searchTracks} />
          </div>
          <br />
          {(this.state.searchResults.length > 0) && <div className="table-ctn">
            <TrackTable
              searchResults={this.state.searchResults}
              playSong={this.playSong} />
          </div>}
        </div>
        <InvoiceModal showQr={this.state.showQr} invoice={this.state.invoice} closeQr={this.closeQr} />
      </div>
    );
  }
}

export default App;
