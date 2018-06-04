import React, { Component } from 'react';

import './App.css';
import Table from './Table';

class App extends Component {
  renderRow(row) {
    return (
      <tr>
        <td>{row.name}</td>
        <td>{row.goals}</td>
      </tr>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Scott Logic Newcastle's World Cup 2018 Sweepstake</h1>
        </header>
        <Table
          headings={['Name', 'Goals']}
          rows={[{name: 'Ashley', goals: '140'}]}
          renderRow={this.renderRow}
        />
      </div>
    );
  }
}

export default App;
