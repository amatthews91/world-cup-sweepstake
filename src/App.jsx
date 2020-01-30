import React, { useState, useEffect } from 'react';

import PlayerTable from './components/PlayerTable';
import CompetitionTable from './components/CompetitionTable';
import UpcomingMatches from './components/UpcomingMatches';

import RefreshIcon from './images/RefreshIcon.svg';
import './App.css';

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);
  const [players, setPlayers] = useState([]);
  const [competitionData, setCompetitionData] = useState({});
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const playerResponse = await fetch(`/api/players?live=${isLiveData}`);
    const playerJson = await playerResponse.json();
    setPlayers(playerJson);

    const competitionResponse = await fetch(`/api/competition/teams?live=${isLiveData}`);
    const competitionJson = await competitionResponse.json();
    setTeams(competitionJson);

    const competitionArray = Object.keys(competitionJson)
      .map(key => {
        return {
          ...competitionJson[key],
          name: key
        };
      });
    setCompetitionData(competitionArray);

    const fixtureResponse = await fetch('/api/competition/fixtures/today');
    const fixtureJson = await fixtureResponse.json();    
    setFixtures(fixtureJson);

    setIsLoading(false);
  };

  const getPrizePool = () => {
    const totalCash = players.length * 3;
    return {
      first: (totalCash * 0.85).toFixed(2),
      last: (totalCash * 0.15).toFixed(2)
    };
  };

  const toggleLiveData = () => isLiveData ? loadData(false) : loadData(true);

  const reloadData = () => {
    if (!isLoading) {
      loadData(isLiveData);
    }
  }
  
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
          <UpcomingMatches matches={fixtures} />
          <div className="tables">
            <PlayerTable
              rows={players}
              teams={teams}
            />
            <CompetitionTable rows={competitionData} />
          </div>
        </div>
      }
    </div>
  );
}

export default App;
