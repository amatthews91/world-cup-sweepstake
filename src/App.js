import React, { Component } from 'react';

import './App.css';
import Table from './Table';

const defaultState = {
  isLoading: true,
  playerData: [],
  competitionData: {}
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  async componentDidMount() {
    const playerResponse = await fetch('/api/generate-players/');
    const playerJson = await playerResponse.json();

    const competitionResponse = await fetch('/api/competition/')
    const competitionJson = await competitionResponse.json();

    this.setState({
      isLoading: false,
      playerData: playerJson,
      competitionData: competitionJson
    });
  }

  renderRow(row) {
    return (
      <tr>
        <td>{row.name}</td>
        <td>{row.teams.goals.join(", ")}</td>
        <td>{row.teams.outcomes.join(", ")}</td>
        <td>{row.goalsPredicted}</td>
        <td>{row.points}</td>
      </tr>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Scott Logic Newcastle's World Cup 2018 Sweepstake</h1>
        </header>
        { this.state.isLoading ?
          <div>
            <p>Loading player data...</p>
          </div>
          : <Table
            headings={['Name', 'Goal Teams', 'Outcome Teams', 'Predicted Total Goals', 'Total Points']}
            rows={this.state.playerData}
            renderRow={this.renderRow}
          />
        }
      </div>
    );
  }
}

export default App;
