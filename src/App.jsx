import React, { Component } from 'react';

import PlayerTable from './components/PlayerTable';
import CompetitionTable from './components/CompetitionTable';

import RefreshIcon from './images/RefreshIcon.svg';
import './App.css';

const defaultState = {
  isLoading: true,
  isLiveData: false,
  playerData: [],
  competitionData: {}
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = defaultState;

    this.toggleLiveData = this.toggleLiveData.bind(this);
    this.reloadData = this.reloadData.bind(this);
  }

  componentDidMount() {
    this.loadData(false);
  }

  async loadData(isLiveData) {
    this.setState({
      ...this.state,
      isLoading: true,
      isLiveData
    });

    const playerResponse = await fetch(`/api/players?live=${isLiveData}`);
    const playerJson = await playerResponse.json();

    const competitionResponse = await fetch(`/api/competition?live=${isLiveData}`)
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
  };

  getPrizePool(players) {
      const totalCash = players.length * 3;
      return {
          first: (totalCash * 0.85).toFixed(2),
          last: (totalCash * 0.15).toFixed(2)
      };
  };

  toggleLiveData() {
    this.state.isLiveData ? this.loadData(false) : this.loadData(true);
  };

  reloadData() {
      if (!this.state.isLoading) {
          this.loadData(this.state.isLiveData);
      }
  }

  render() {
    const prizePool = this.getPrizePool(this.state.playerData);
    return (
      <div className="App">
        <header className="App-header">
          <h1>Scott Logic Newcastle's World Cup 2018 Sweepstake</h1>
        </header>
        <div className="data-options">
            <label className="live-data-checkbox"
                title="By default only displaying data for finished games, checking this will also use games which are in play to display the tables 'as it stands'">
                <input
                    type="checkbox"
                    disabled={this.state.isLoading}
                    checked={this.state.isLiveData}
                    onChange={this.toggleLiveData}
                />
                Use live data?
            </label>
            <div className="refresh-data" onClick={this.reloadData}>
                <img className="refresh-icon" alt="Refresh" src={RefreshIcon} width="24" height="16" />
                Refresh data
            </div>
        </div>
        { this.state.isLoading ?
            <div className="loading">
                <p>Loading competition data...</p>
            </div>
            : <div className="content">
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
