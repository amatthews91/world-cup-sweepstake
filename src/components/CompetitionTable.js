import React, { Component } from 'react';

import Table from './Table';
import './CompetitionTable.css';

const headings = ['Name', 'Goals', 'Wins', 'Draws'];

class CompetitionTable extends Component {

    getTotalGoals(rows) {
        return rows.map(row => row.goals).reduce((tally, next) => tally + next);
    }

    renderRow(row) {
        return (
            <tr key={row.name}>
                <td><img className="flag" alt="Flag" src={row.flag} width="24" height="16" /> {row.name}</td>
                <td>{row.goals}</td>
                <td>{row.wins}</td>
                <td>{row.draws}</td>
            </tr>
        );
    }

    render() {
        return (
            <div className="competition-table">
                <h2>Competition Stats</h2>
                <p>Total Goals: {this.getTotalGoals(this.props.rows)}</p>
                <Table
                    headings={headings}
                    rows={this.props.rows}
                    renderRow={this.renderRow}
                />
            </div>
        );
    }
}

export default CompetitionTable;
