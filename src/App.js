import React, { Component } from 'react';

import './App.css';
import PlayerTable from './components/PlayerTable';
import CompetitionTable from './components/CompetitionTable';

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
    const playerResponse = await fetch('/api/players/');
    const playerJson = await playerResponse.json();

    const competitionResponse = await fetch('/api/competition/')
    const competitionJson = await competitionResponse.json();

    const competitionArray = Object.keys(competitionJson)
      .map(key => {
        return {
          ...competitionJson[key],
          name: key
        };
      });

    this.setState({
      isLoading: false,
      playerData: playerJson,
      competitionData: competitionArray
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Scott Logic Newcastle's World Cup 2018 Sweepstake</h1>
        </header>
        { this.state.isLoading ?
          <div>
            <p>Loading competition data...</p>
          </div>
          : <div className="tables">
              <PlayerTable rows={this.state.playerData} />
              <CompetitionTable rows={this.state.competitionData} />
          </div>
        }
      </div>
    );
  }
}

export default App;
