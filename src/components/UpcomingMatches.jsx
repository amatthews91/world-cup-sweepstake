import React from 'react';
import moment from 'moment';

import './UpcomingMatches.css';

const UpcomingMatches = ({
  matches
}) => {

  const getMatchTime = (date) => moment(date).format('HH:mm');  

  const getMatchStatus = (match) => {
    switch (match.status) {
      case 'IN_PLAY':
        return <span className="status-live">Live</span>;
      case 'FINISHED':
        return <span>FT</span>;
      default:
        return <span></span>;
    }
  }

  const renderRow = (match) => (
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
          <div className="match-time">{getMatchTime(match.date)}</div>
        }
        <div className="match-team match-team-away">{match.awayTeamName}</div>
      </div>
      <div className="match-status">{getMatchStatus(match)}</div>
    </div>
  );

  return (
    <div className="upcoming-matches">
      <h2>Today's Matches</h2>
      { matches.length === 0 ?
        <div>No matches scheduled for today</div> :
        <div className="match-info">
          { matches.map(match => renderRow(match)) }
        </div>
      }
    </div>
  );
}

export default UpcomingMatches;
