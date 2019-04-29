import React, { Component } from 'react';
import ProgressBar from './ProgressBar/ProgressBar.js';
import AudioIcon from './Icon/AudioIcon.js';
import './NowPlaying.css'

class NowPlaying extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      songTitle: '',
      artists: '',
      currentTime: 0,
      duration: 0,
      showProgress: false,
      device: '',
    }
  }

  intervalPlayingID = 0;

  componentDidMount = () => {
    this.getNowPlaying();
    this.intervalPlayingID = setInterval(this.getNowPlaying, 1000);
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalPlayingID);
  }

  getNowPlaying = () => {
    if (this.props.loggedIn) {
      this.props.spotifyApi.getMyCurrentPlaybackState()
        .then((response) => {
          console.log(response);
          if (response.is_playing) {
            this.setState({
              songTitle: response.item.name,
              imageUrl: response.item.album.images[1].url,
              artists: response.item.artists[0].name,
              currentTime: response.progress_ms,
              duration: response.item.duration_ms,
              showProgress: true
            });
          } else {
            this.props.spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 })
              .then((response) => {
                this.setState({
                  songTitle: response.items[0].track.name,
                  imageUrl: response.items[0].track.album.images[0].url,
                  artists: response.items[0].track.album.artists[0].name,
                });
              });
          }
        })
        .catch((err) => {
          console.log("Error getting current playback state")
        });
    }
  }

  render = () => {
    return (
      <div
        className="player-ctn">
        <div>
          <img
            alt="now-playing"
            className="player-image"
            src={this.state.imageUrl} />
        </div>
        <span
          className="player-title">
          {this.state.songTitle}
        </span>
        <span
          className="player-artist">
          {this.state.artists}
        </span>
        {this.state.showProgress &&
          <ProgressBar
            currentTime={this.state.currentTime / 1000}
            duration={this.state.duration / 1000} />}
        {this.props.device &&
          <div
            className="device-ctn">
            <AudioIcon /> &nbsp; {this.props.device}
          </div>}
      </div>
    );
  }
}

export default NowPlaying;