import React from 'react';

import Table from './Table';
import './CompetitionTable.css';

const headings = ['Name', 'Goals', 'Wins', 'Draws', 'Losses'];

const CompetitionTable = ({
  rows
}) => {

  const getTotalGoals = (rows) => rows.map(row => row.goals).reduce((tally, next) => tally + next);

  const renderRow = (row) => (
    <tr key={row.name} className={row.isEliminated ? 'team-eliminated' : ''}>
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
