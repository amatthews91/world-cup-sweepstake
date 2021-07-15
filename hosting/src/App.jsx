import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import getPlayersWithPoints from './pointsCalculator';
import getTeamsWithOutcomeData from './teamOutcomeCalculator';
import PlayerTable from './components/PlayerTable';
import CompetitionTable from './components/CompetitionTable';
import ErrorWrapper from './components/Error';
import Timeline from './components/Timeline';

import './App.css';

const LOCAL_API_BASE='http://localhost:5001/euro-sweepstake/us-central1/api';

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState({});
  const [error, setError] = useState(undefined);
  const [matchDays, setMatchDays] = useState([]);
  const [selectedMatchDay, setSelectedMatchDay] = useState(null);

  const getData = async (url, mapFunc) => {
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json);
    }

    return mapFunc ? mapFunc(json) : json;
  }

  const loadData = async () => {
    setIsLoading(true);

    try {
      const newPlayers = await getData(`${LOCAL_API_BASE}/players`);
      const newTeams = await getData(`${LOCAL_API_BASE}/competition/teams`);
      const newFixtures = await getData(
        `${LOCAL_API_BASE}/api/competition/fixtures`,
        fixtures => fixtures.map(f => ({ ...f, luxonDate: DateTime.fromISO(f.utcDate)}))
      );

      const teamsWithOutcomeData = getTeamsWithOutcomeData(newFixtures, newTeams);

      setTeams(teamsWithOutcomeData);
      setPlayers(getPlayersWithPoints(newPlayers, teamsWithOutcomeData));
      setFixtures(newFixtures);

      const uniqueMatchDays = getUniqueMatchDays(newFixtures);
      setMatchDays(uniqueMatchDays);
      setSelectedMatchDay(uniqueMatchDays[uniqueMatchDays.length - 1]);
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

  const onSelectMatchDay = (matchDay) => {
    setSelectedMatchDay(matchDay);
    const teamsWithOutcomeData = getTeamsWithOutcomeData(fixtures, teams, matchDay);
    setPlayers(getPlayersWithPoints(players, teamsWithOutcomeData));
  };

  const getUniqueMatchDays = (fixtures) => {
    const newMatchDays = [];
    fixtures.forEach(({ luxonDate }) => {
      if (newMatchDays.findIndex(el => el.hasSame(luxonDate, 'day')) < 0) {
        newMatchDays.push(luxonDate);
      }
    });
    newMatchDays.sort((d1, d2) => d1 > d2);
    return newMatchDays;
  };

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
            matchDays={matchDays}
            selectedMatchDay={selectedMatchDay}
            onSelectMatchDay={onSelectMatchDay}
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
