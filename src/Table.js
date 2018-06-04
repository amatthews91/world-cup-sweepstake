import  React, { Component } from 'react';

import './Table.css';

class Table extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            { this.props.headings.map(title => <th key={title}>{title}</th>) }
          </tr>
        </thead>
        <tbody>
          { this.props.rows.map(row => this.props.renderRow(row)) }
        </tbody>
      </table>
    );
  }
}

export default Table;
