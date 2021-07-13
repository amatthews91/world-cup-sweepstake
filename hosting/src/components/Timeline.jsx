import React, { useEffect, useState } from 'react';

import './Timeline.css';

const Timeline = ({
  fixtures
}) => {

  const [matchDays, setMatchDays] = useState([]);

  // Find all unique matchDays
  useEffect(() => {
    const newMatchDays = [];
    fixtures.forEach(({ luxonDate }) => {
      if (newMatchDays.findIndex(el => el.hasSame(luxonDate, 'day')) < 0) {
        newMatchDays.push(luxonDate);
      }
    });
    newMatchDays.sort((d1, d2) => d1 > d2);
    setMatchDays(newMatchDays);
  }, [fixtures]);

  return (
    <div className="timeline">
      {matchDays.map(matchDay =>
        <div className="matchday">
          <div className="bubble"></div>
          {/* <div className="date">{matchDay.toISODate()}</div> */}
        </div>
      )}
    </div>
  );
};

export default Timeline;
