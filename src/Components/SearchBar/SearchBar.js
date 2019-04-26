import React, { Component } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    }
  }

  handleChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  search(text) {
    if (text) {
      this.props.handleSearch(text);
      this.setState({
        searchText: ''
      });
    }
  }

  render() {
    return (
      <InputGroup>
        <FormControl
          onChange={this.handleChange}
          value={this.state.searchText}
          onKeyPress={event => {
            if (event.key === "Enter") {
              this.search(this.state.searchText);
            }
          }}
          placeholder="Search by Track, Artist, or Album"
          aria-label="Search by Track, Artist, or Album"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append>
          <Button onClick={this.search.bind(this, this.state.searchText)} variant="outline-secondary">Search</Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

export default SearchBar;