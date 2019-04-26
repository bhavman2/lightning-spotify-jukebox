import React from 'react';
import { Table } from 'react-bootstrap';
import './TrackTable.css'


function TrackTable(props) {
  const searchText = props.searchResults.length === 0 ? <tr><td colSpan="2">Start a new search above</td></tr> : undefined

  return (
    <Table
      striped
      hover
      variant="dark">
      <thead>
        <tr>
          <th>Song</th>
          <th>Artists</th>
        </tr>
      </thead>
      <tbody>
        {searchText}
        {props.searchResults.map((song, i) => {
          return (
            <tr onClick={props.playSong.bind(this, song.uri)} key={i}>
              <td>{song.name}</td>
              <td>{song.artists.map((artist, i) => {
                return i !== song.artists.length - 1 ? artist.name + ', ' : artist.name;
              })}</td>
            </tr>)
        })}
      </tbody>
    </Table>
  );
}

export default TrackTable;