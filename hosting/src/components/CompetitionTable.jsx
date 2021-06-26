import React from 'react';
import classnames from 'classnames';

import Table from './Table';
import './CompetitionTable.css';

const headings = [
  { title: 'Name' },
  { title: 'Goals' },
  { title: 'Wins' },
  { title: 'Draws' },
  { title: 'Losses' }
];

const CompetitionTable = ({
  rows,
  onHover
}) => {

  const getTotalGoals = (rows) => rows.map(row => row.goals).reduce((tally, next) => tally + next);

  const rowClassnames = row => classnames({
    'team-eliminated': row.isEliminated,
    'team-highlighted': row.isHighlighted
  });

  const renderRow = (row) => (
    <tr
      key={row.name}
      className={rowClassnames(row)}
      onMouseEnter={e => onHover(row.name)}
      onMouseOut={_ => onHover(undefined)}
    >
      <td><img className="flag" alt="Flag" src={row.flag} width="24" height="16" /> {row.name}</td>
      <td>{row.goals}</td>
      <td>{row.wins}</td>
      <td>{row.draws}</td>
      <td>{row.losses}</td>
    </tr>
  );

  return (
    <div className="competition-table">
      <h2>Competition Stats</h2>
      <p>Total Goals: {getTotalGoals(rows)}</p>
      <Table
        headings={headings}
        rows={rows}
        renderRow={renderRow}
      />
    </div>
  );
}

export default CompetitionTable;
