import React, { useState, useEffect } from 'react';

import PlayerTable from './components/PlayerTable';
import CompetitionTable from './components/CompetitionTable';
import MatchInfo from './components/MatchInfo';

import RefreshIcon from './images/RefreshIcon.svg';
import './App.css';
import { DateTime } from 'luxon';

const ENTRY_FEE = 2;

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState([]);

  const loadData = async (isLiveData) => {
    setIsLoading(true);

    const playerResponse = await fetch(`/api/players?live=${isLiveData}`);
    const playerJson = await playerResponse.json();
    setPlayers(playerJson);

    const teamResponse = await fetch(`/api/competition/teams?live=${isLiveData}`);
    const teamJson = await teamResponse.json();
    setTeams(teamJson);

    const fixtureResponse = await fetch('/api/competition/fixtures');
    const fixtureJson = await fixtureResponse.json();
    setFixtures(fixtureJson.map(f => ({ ...f, luxonDate: DateTime.fromISO(f.utcDate)}) ));

    setIsLoading(false);
  };

  const getTeamsAsArray = (teams) => {
    return Object.keys(teams)
      .map(key => {
        return {
          ...teams[key],
          name: key
        };
      });
  }

  const getPrizePool = () => {
    const totalCash = players.length * ENTRY_FEE;
    return {
      first: (totalCash * 0.85).toFixed(2),
      last: (totalCash * 0.15).toFixed(2)
    };
  };

  const reloadData = () => {
    if (!isLoading) {
      loadData();
    }
  }

  const toggleLiveData = () => setIsLiveData(!isLiveData);

  useEffect(() => { loadData(isLiveData) }, [isLiveData]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Scott Logic Newcastle's Euro 2020? Sweepstake</h1>
      </header>
      <div className="data-options">
        <label className="live-data-checkbox"
          title="By default only displaying data for finished games, checking this will also use games which are in play to display the tables 'as it stands'">
          <input
            type="checkbox"
            disabled={isLoading}
            checked={isLiveData}
            onChange={toggleLiveData}
          />
          Use live data for tables?
        </label>
        <div className="refresh-data" onClick={reloadData}>
          <img className="refresh-icon" alt="Refresh" src={RefreshIcon} width="24" height="16" />
            Refresh data
          </div>
      </div>
      {isLoading ?
        <div className="loading">
          <p>Loading competition data...</p>
        </div> :
        <div className="content">
          <div className="prize-pool">
            <h2>Current Prize Pool</h2>
            <p>First: &pound;{getPrizePool().first} Last: &pound;{getPrizePool().last}</p>
          </div>
          <MatchInfo matches={fixtures} />
          <div className="tables">
            <PlayerTable
              rows={players}
              teams={teams}
            />
            <CompetitionTable rows={getTeamsAsArray(teams)} />
          </div>
        </div>
      }
    </div>
  );
}

export default App;
