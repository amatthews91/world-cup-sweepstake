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
        { rows.map(row => renderRow(row)) }
      </tbody>
    </table>
  );  
}

export default Table;
