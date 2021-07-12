import React from 'react';
import classnames from 'classnames';

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
  rows,
  onHover
}) => {
  const isTeamEliminated = (team) => teams[team].isEliminated;

  const teamClassNames = (team, allTeams) => classnames({
    'team-eliminated': allTeams[team].isEliminated,
    'team-highlighted': allTeams[team].isHighlighted
  });

  const renderTeamColumn = (cellTeams, allTeams) => {
    if (!cellTeams || cellTeams.length === 0) {
      return <span></span>;
    }

    return cellTeams.map((team, i) => (
      <td
        key={i}
        className={teamClassNames(team, allTeams)}
        onMouseEnter={e => onHover(team)}
        onMouseOut={_ => onHover(undefined)}
      >
        {team}
      </td>
    ));
  }

  const areAllPlayerTeamsEliminated = ({
    goals,
    outcomes
  }) => goals.every(isTeamEliminated) && outcomes.every(isTeamEliminated);

  const renderRow = (row, rank) => {
    const classNames = classnames({
      'player-eliminated': areAllPlayerTeamsEliminated(row.teams)
    });

    return (
      <tr
        key={row.name}
        className={classNames}
      >
        <td>{rank}</td>
        <td>{row.name}</td>
        {renderTeamColumn(row.teams.goals, teams)}
        {renderTeamColumn(row.teams.outcomes, teams)}
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
