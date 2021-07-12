import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import PlayerTable from './components/PlayerTable';
import CompetitionTable from './components/CompetitionTable';
import ErrorWrapper from './components/Error';
import Timeline from './components/Timeline';

import './App.css';

const LOCAL_API_BASE='http://localhost:5001/euro-sweepstake/us-central1/api';

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  // eslint-disable-next-line
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

  const loadData = async () => {
    setIsLoading(true);

    try {
      await getData(`${LOCAL_API_BASE}/players`, setPlayers);
      await getData(`${LOCAL_API_BASE}/competition/teams`, setTeams);
      await getData(
        `${LOCAL_API_BASE}/api/competition/fixtures`,
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

  const onTeamHover = (team) => {
    const newTeams = { ...teams };
    Object.keys(newTeams).forEach(t => {
        newTeams[t].isHighlighted = (t === team);
    });
    setTeams(newTeams);
  }

  useEffect(() => { loadData() }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sweepstake Points Test Utility</h1>
      </header>

      { error && <ErrorWrapper message={error} /> }

      {isLoading &&
        <div className="loading">
          <p>Loading competition data...</p>
        </div>
      }

      {!isLoading && !error &&
        <div className="content">
          <Timeline
            fixtures={fixtures}
          />
          <div className="tables">
            <PlayerTable
              rows={players}
              teams={teams}
              onHover={onTeamHover}
            />
            <CompetitionTable
                rows={getTeamsAsArray(teams)}
                onHover={onTeamHover}
            />
          </div>
        </div>
      }

    </div>
  );
}

export default App;
