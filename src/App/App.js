import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { InputGroup, FormControl, Table, Button } from 'react-bootstrap';
import './App.css';

const spotifyApi = new SpotifyWebApi();
const queryString = require('query-string');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      access_token: '',
      refresh_token: '',
      searchText: '',
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
      spotifyApi.setAccessToken(access_token);
      spotifyApi.getMyDevices((err, data) => {
        console.log(data);
      })
    } else {
      console.log('No access token present, try logging in again.')
    }
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log(response);
        this.setState({
          nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url
          }
        });
      })
  }

  handleChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  handleSearch = () => {
    console.log(this.state.searchText)
    spotifyApi.searchTracks(this.state.searchText, { limit: 10, explicit: false })
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

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888/login' > Login to Spotify </a>
        <div>
          {/* Now Playing: {this.state.nowPlaying.name} */}
        </div>
        <div>
          {/* <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} /> */}
        </div>
        {this.state.loggedIn &&
          <Button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </Button>}
        <br />
        <Button onClick={this.resumePlaylist}>Resume</Button>

        <br />
        <br />
        <InputGroup className="mb-3">
          <FormControl
            onChange={this.handleChange}
            onSubmit={this.handleSearch}
            placeholder="Search by Track, Artist, or Album"
            aria-label="Search by Track, Artist, or Album"
            aria-describedby="basic-addon2"
          />
          <InputGroup.Append>
            <Button onClick={this.handleSearch} variant="outline-secondary">Search</Button>
          </InputGroup.Append>
        </InputGroup>
        <br />

        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Song</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            {this.state.searchResults.map((song, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td><Button onClick={this.playSong.bind(this, song.uri)} variant="dark">Play</Button> {song.name}</td>
                  <td>{song.artists[0].name}</td>
                </tr>)
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
