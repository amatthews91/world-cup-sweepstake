import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import './Timeline.css';

const Timeline = ({
  fixtures,
  selectedMatchDay,
  onSelectMatchDay
}) => {

  const [matchDays, setMatchDays] = useState([]);

  const isSelectedMatchDay = (matchDay) => matchDay.hasSame(selectedMatchDay, 'day');

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
    onSelectMatchDay(newMatchDays[newMatchDays.length-1]);
  }, [fixtures]);

  const bubbleClassNames = matchDay => classnames({
    'bubble': true,
    'selected-match-day': selectedMatchDay ? isSelectedMatchDay(matchDay) : false
  });

  return (
    <div className="timeline">
      {matchDays.map(matchDay =>
        <div
          key={matchDay.toISODate()}
          className="matchday"
          onClick={() => onSelectMatchDay(matchDay)}
        >
          <div className={bubbleClassNames(matchDay)}></div>
          <div 
            className="date"
            hidden={!isSelectedMatchDay(matchDay)}
          >
            {matchDay.toISODate()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
