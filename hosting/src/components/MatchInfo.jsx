import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import './MatchInfo.css';

const UpcomingMatches = ({
  matches
}) => {

  const [upcomingMatches, setUpcomingMatches] = useState([]);

  const isToday = (dt) => dt.hasSame(DateTime.utc(), 'day');
  const getMatchTime = (date) => DateTime.fromISO(date).toLocaleString(DateTime.TIME_24_SIMPLE);

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

  const renderMatchDate = (matchTime) => {
    const dt = DateTime.fromISO(matchTime);
    if (isToday(dt)) {
      return <h3 className="match-date">Today</h3>;
    } else {
      return <h3 className="match-date">{DateTime.fromISO(upcomingMatches[0].utcDate).toFormat('dd MMMM')}</h3>;
    }
  }

  useEffect(() => {
    setUpcomingMatches(matches.filter(m => isToday(DateTime.fromISO(m.utcDate))));
  }, [matches])

  return (
    <div className="upcoming-matches">
      <h2>Upcoming Matches</h2>
      { upcomingMatches.length === 0 ?
        <div>No further matches scheduled</div> :
        <div className="match-info">
          { renderMatchDate(upcomingMatches[0].utcDate) }
          { upcomingMatches.map(match => renderRow(match)) }
        </div>
      }
    </div>
  );
}

export default UpcomingMatches;
