import React, { Component } from 'react';

import Table from './Table';

const headings = ['Name', 'Goal Teams', 'Outcome Teams', 'Predicted Total Goals', 'Total Points'];

class PlayerTable extends Component {
    renderTeams(teams) {
        return (
            <table>
                <tbody>
                    <tr>
                        {teams.map(team => (
                            <td key={team.name}>
                                {this.props.teams[team].isEliminated ? <s>{team}</s> : team}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        )
    }

    renderRow = (row) => {
        return (
            <tr key={row.name}>
                <td>{row.name}</td>
                <td>{this.renderTeams(row.teams.goals)}</td>
                <td>{this.renderTeams(row.teams.outcomes)}</td>
                <td>{row.goalsPredicted}</td>
                <td>{row.points}</td>
            </tr>
        );
    }

    render() {
        return (
            <div className="player-table">
                <h2>Players</h2>
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
