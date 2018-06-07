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

    getPrizePool(players) {
        const totalCash = players.length * 3;
        return {
            first: totalCash * 0.85,
            last: totalCash * 0.15
        };
    };

  render() {
    const prizePool = this.getPrizePool(this.state.playerData);
    return (
      <div className="App">
        <header className="App-header">
          <h1>Scott Logic Newcastle's World Cup 2018 Sweepstake</h1>
        </header>
        { this.state.isLoading ?
          <div>
            <p>Loading competition data...</p>
          </div>
          :
          <div className="content">
            <div className="prize-pool">
                <h2>Current Prize Pool</h2>
                <p>First: &pound;{prizePool.first} Last: &pound;{prizePool.last}</p>
            </div>
            <div className="tables">
                <PlayerTable rows={this.state.playerData} />
                <CompetitionTable rows={this.state.competitionData} />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
