import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import PlayerTable from './components/PlayerTable';
import CompetitionTable from './components/CompetitionTable';
import MatchInfo from './components/MatchInfo';
import ErrorWrapper from './components/Error';

import RefreshIcon from './images/RefreshIcon.svg';
import './App.css';

const ENTRY_FEE = 2;

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState({});
  const [error, setError] = useState(undefined);

  const getData = async (url, setFunc, mapFunc) => {
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json);
    }

    setFunc(mapFunc ? mapFunc(json) : json);
  }

  const loadData = async (isLiveData) => {
    setIsLoading(true);

    try {
      await getData(`/api/players?live=${isLiveData}`, setPlayers);
      await getData(`/api/competition/teams?live=${isLiveData}`, setTeams);
      await getData(
        '/api/competition/fixtures',
        setFixtures,
        fixtures => fixtures.map(f => ({ ...f, luxonDate: DateTime.fromISO(f.utcDate)}))
      );
    } catch (err) {
      setError(err.message);
    }

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

  const onTeamHover = (team) => {
    const newTeams = { ...teams };
    Object.keys(newTeams).forEach(t => {
        newTeams[t].isHighlighted = (t === team);
    });
    setTeams(newTeams);
  }

  useEffect(() => { loadData(isLiveData) }, [isLiveData]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Scott Logic Newcastle's World Cup 2022 Sweepstake</h1>
      </header>

      { error && <ErrorWrapper message={error} /> }

      {isLoading &&
        <div className="loading">
          <p>Loading competition data...</p>
        </div>
      }

      {!isLoading && !error &&
        <div className="content">
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
          <div className="left">
            <div className="prize-pool">
              <h2>Current Prize Pool</h2>
              <p>First: &pound;{getPrizePool().first} Last: &pound;{getPrizePool().last}</p>
            </div>
            <MatchInfo matches={fixtures} />
              <PlayerTable
                rows={players}
                teams={teams}
                onHover={onTeamHover}
              />
          </div>
          <CompetitionTable
              rows={getTeamsAsArray(teams)}
              onHover={onTeamHover}
          />
        </div>
      }

    </div>
  );
}

export default App;
