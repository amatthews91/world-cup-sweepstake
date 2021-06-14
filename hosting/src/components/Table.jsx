import  React from 'react';

import './Table.css';

const Table = ({
  headings,
  rows,
  renderRow
}) => {
  return (
    <table>
      <thead>
        <tr>
          { headings.map(title => <th key={title}>{title}</th>) }
        </tr>
      </thead>
      <tbody>
        { rows.map((row, i) => renderRow(row, i+1)) }
      </tbody>
    </table>
  );
}

export default Table;
