import React, { Component } from 'react';

import Table from './Table';

const headings = ['Name', 'Goals', 'Wins', 'Draws'];

class PlayerTable extends Component {

    renderRow(row) {
        return (
            <tr>
                <td>{row.name}</td>
                <td>{row.goals}</td>
                <td>{row.wins}</td>
                <td>{row.draws}</td>
            </tr>
        );
    }

    render() {
        return (
            <div className="competition-table">
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
