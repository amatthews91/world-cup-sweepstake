import React, { Component } from 'react';

import Table from './Table';

const headings = ['Name', 'Goal Teams', 'Outcome Teams', 'Predicted Total Goals', 'Total Points'];

class PlayerTable extends Component {

    renderRow(row) {
        return (
            <tr>
                <td>{row.name}</td>
                <td>{row.teams.goals.join(", ")}</td>
                <td>{row.teams.outcomes.join(", ")}</td>
                <td>{row.goalsPredicted}</td>
                <td>{row.points}</td>
            </tr>
        );
    }

    render() {
        return (
            <div className="player-table">
                <Table
                    headings={headings}
                    rows={this.props.rows}
                    renderRow={this.renderRow}
                />
            </div>
        );
    }
}

export default PlayerTable;
