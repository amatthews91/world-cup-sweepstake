import React, { Component } from 'react';
import moment from 'moment';

import './UpcomingMatches.css';

class UpcomingMatches extends Component {

  getMatchTime(date) {
    return moment(date).format('HH:mm');
  }

  getMatchStatus(match) {
    switch (match.status) {
      case 'IN_PLAY':
        return <span className="status-live">Live</span>;
      case 'FINISHED':
        return <span>FT</span>;
      default:
        return <span></span>;
    }
  }

  renderRow(match) {
    return(
      <div key={`${match.homeTeamName}-${match.awayTeamName}`} className="match-row">
        <div className='match-result'>
          <div className="match-team match-team-home">{match.homeTeamName}</div>
          { match.status === 'IN_PLAY' || match.status === 'FINISHED' ?
            <div className="match-score">
              <div className="match-goals match-goals-home">
                {match.result.goalsHomeTeam}
              </div>
              <div className="match-goals match-goals-away">
                {match.result.goalsAwayTeam}
              </div>
            </div> :
            <div className="match-time">{this.getMatchTime(match.date)}</div>
          }
          <div className="match-team match-team-away">{match.awayTeamName}</div>
        </div>
        <div className="match-status">{this.getMatchStatus(match)}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="upcoming-matches">
        <h2>Today's Matches</h2>
        <div className="match-info">
          { this.props.matches.map(match => this.renderRow(match)) }
        </div>
      </div>
    );
  }

}

export default UpcomingMatches;
