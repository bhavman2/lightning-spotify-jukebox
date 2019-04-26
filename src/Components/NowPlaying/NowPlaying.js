import React, { Component } from 'react';
import ProgressBar from '../ProgressBar/ProgressBar.js';
import './NowPlaying.css'


class NowPlaying extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      songTitle: '',
      artists: ''
    }
  }

  intervalID = 0;

  componentDidMount = () => {
    this.getNowPlaying();
    this.intervalID = setInterval(this.getNowPlaying, 5000);
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalID);
  }

  getNowPlaying = () => {
    if (this.props.loggedIn) {
      this.props.spotifyApi.getMyCurrentPlaybackState()
        .then((response) => {
          console.log(response);
          if (response) {
            this.setState({
              songTitle: response.item.name,
              imageUrl: response.item.album.images[0].url,
              artists: response.item.artists[0].name,
              currentTime: response.progress_ms,
              duration: response.item.duration_ms
            });
          }
        });
    }
  }

  render(props) {
    return (
      <div className="player-ctn">
        <div>
          <img alt="now-playing" className="player-image" src={this.state.imageUrl} />
        </div>
        <span className="player-title">
          {this.state.songTitle}
        </span>
        <span className="player-artist">
          {this.state.artists}
        </span>
        <ProgressBar currentTime={this.state.currentTime / 1000} duration={this.state.duration / 1000} />
      </div>
    );
  }
}

export default NowPlaying;