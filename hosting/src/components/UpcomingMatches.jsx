import React from 'react';
import moment from 'moment';

import './UpcomingMatches.css';

const UpcomingMatches = ({
  matches
}) => {

  const getMatchTime = (date) => moment(date).format('HH:mm');

  const renderInfo = (match) => {
    switch (match.status) {
      case 'IN_PLAY':
        return <div className="status-live">Live</div>;
      case 'FINISHED':
        return <div className="match-score">
            <div className="match-goals match-goals-home">
              {match.score.fullTime.homeTeam}
            </div>
            <div className="match-goals match-goals-away">
              {match.score.fullTime.awayTeam}
            </div>
          </div>;
      default:
        return <div className="match-time">{getMatchTime(match.utcDate)}</div>
    }
  }

  const renderRow = (match) => (
    <div key={`${match.homeTeam.name}-${match.awayTeam.name}`} className="match-row">
      <div className='match-result'>
        <div className="match-team match-team-home">{match.homeTeam.name}</div>
        {renderInfo(match)}
        <div className="match-team match-team-away">{match.awayTeam.name}</div>
      </div>
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
