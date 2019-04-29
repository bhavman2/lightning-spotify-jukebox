import React from "react";
import './ProgressBar.css';

const readableDuration = seconds => {
  let sec = Math.floor(seconds);
  let min = Math.floor(sec / 60);
  min = min >= 10 ? min : "0" + min;
  sec = Math.floor(sec % 60);
  sec = sec >= 10 ? sec : "0" + sec;
  return min + ":" + sec;
};

function ProgressBar(props) {
  const { duration, currentTime } = props;
  return (
    <div>
      <div 
      className="duration">
        <div>{readableDuration(currentTime)}</div>
        <div>{readableDuration(duration)}</div>
      </div>
      <div 
      className="progress">
        <div
          className="progress-bar"
          style={{ width: `${(currentTime + 0.25) / duration * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;