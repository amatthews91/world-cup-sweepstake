import React from 'react';

import Table from './Table';

const headings = ['Name', 'Goal Teams', 'Outcome Teams', 'Predicted Total Goals', 'Total Points'];

const PlayerTable = ({
  teams,
  rows
}) => {
  const isTeamEliminated = (team) => teams[team].isEliminated;

  const renderTeams = (teams) => {
    if (!teams || teams.length === 0) {
      return <span></span>;
    }
    return teams.map(team => (
      isTeamEliminated(team) ? <s>{team}</s> : team
    )).reduce((prev, curr) => [prev, ', ', curr]);
  }

  const areAllPlayerTeamsEliminated = ({
    goals,
    outcomes
  }) => goals.every(isTeamEliminated) && outcomes.every(isTeamEliminated);

  const renderRow = (row) => {
    const className = areAllPlayerTeamsEliminated(row.teams) ? 'team-eliminated' : ''

    return (
      <tr
        key={row.name}
        className={className}
      >
        <td>{row.name}</td>
        <td>{renderTeams(row.teams.goals)}</td>
        <td>{renderTeams(row.teams.outcomes)}</td>
        <td>{row.goalsPredicted}</td>
        <td>{row.points}</td>
      </tr>
    );
  }

  return (
    <div className="player-table">
      <h2>Players</h2>
      <Table
        headings={headings}
        rows={rows}
        renderRow={renderRow}
      />
    </div>
  );
}

export default PlayerTable;
