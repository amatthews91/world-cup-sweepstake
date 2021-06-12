import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import './MatchInfo.css';

const UpcomingMatches = ({
  matches
}) => {

  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [today] = useState(DateTime.utc());

  const areDatesSameDay = (d1, d2) => d1.hasSame(d2, 'day');
  const getMatchTime = (date) => date.toLocaleString(DateTime.TIME_24_SIMPLE);

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
        return <div className="match-time">{getMatchTime(match.luxonDate)}</div>
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

  const renderMatchDate = (dt) => {
    if (areDatesSameDay(DateTime.utc(), dt)) {
      return <h3 className="match-date">Today</h3>;
    } else {
      return <h3 className="match-date">{upcomingMatches[0].luxonDate.toFormat('dd MMMM')}</h3>;
    }
  }

  useEffect(() => {
    // Get all matches from today.
    const allUpcoming = matches.filter(m => m.luxonDate.diff(today, 'days').toObject().days >= 0);

    // Get matches that are on the next match day.
    setUpcomingMatches(matches.filter(m => areDatesSameDay(allUpcoming[0].luxonDate, m.luxonDate)));
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
