import React from 'react';
import moment from 'moment';

import './UpcomingMatches.css';

const UpcomingMatches = ({
  matches
}) => {

  // TODO: Convert UTC to BST.
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
    <div key={`${match.homeTeam.name}-${match.awayTeam.name}`} className="match-row">
      <div className='match-result'>
        <div className="match-team match-team-home">{match.homeTeam.name}</div>
        { match.status === 'IN_PLAY' || match.status === 'FINISHED' ?
          <div className="match-score">
            {/* TODO: Handle extra time scores. (Based on match.score.duration field) */}
            <div className="match-goals match-goals-home">
              {match.score.fullTime.homeTeam}
            </div>
            <div className="match-goals match-goals-away">
              {match.score.fullTime.awayTeam}
            </div>
          </div> :
          <div className="match-time">{getMatchTime(match.utcDate)}</div>
        }
        <div className="match-team match-team-away">{match.awayTeam.name}</div>
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
