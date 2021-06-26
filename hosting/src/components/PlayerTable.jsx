import React from 'react';

import Table from './Table';

const headings = [
  { title: '#' },
  { title: 'Name' },
  { title: 'Goal Teams', colspan: 2 },
  { title: 'Outcome Teams', colspan: 3 },
  { title: 'Goals Predicted' },
  { title: 'Total Points' }
];

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
      <td className={isTeamEliminated(team) && 'team-eliminated'}>{team}</td>
    ));
  }

  const areAllPlayerTeamsEliminated = ({
    goals,
    outcomes
  }) => goals.every(isTeamEliminated) && outcomes.every(isTeamEliminated);

  const renderRow = (row, rank) => {
    const className = areAllPlayerTeamsEliminated(row.teams) ? 'team-eliminated' : ''

    return (
      <tr
        key={row.name}
        className={className}
      >
        <td>{rank}</td>
        <td>{row.name}</td>
        {renderTeams(row.teams.goals)}
        {renderTeams(row.teams.outcomes)}
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
