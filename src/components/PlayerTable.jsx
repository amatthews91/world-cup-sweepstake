import React, { Component } from 'react';

import Table from './Table';

const headings = ['Name', 'Goal Teams', 'Outcome Teams', 'Predicted Total Goals', 'Total Points'];

class PlayerTable extends Component {
    isTeamEliminated = (team) => {
        return this.props.teams[team].isEliminated;
    }

    renderTeams(teams) {
        return teams.map(team => (
            this.isTeamEliminated(team) ? <s>{team}</s> : team
        )).reduce((prev, curr) => [prev, ', ', curr])
    }

    areAllPlayerTeamsEliminated({ goals, outcomes }) {
        const areAllTeamsEliminated = teams => teams.every(this.isTeamEliminated)

        return areAllTeamsEliminated(goals) && areAllTeamsEliminated(outcomes)
    }

    renderRow = (row) => {
        const className = this.areAllPlayerTeamsEliminated(row.teams) ? 'team-eliminated' : ''

        return (
            <tr
                key={row.name}
                className={className}
            >
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
