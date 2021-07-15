import React from 'react';
import classnames from 'classnames';

import './Timeline.css';

const Timeline = ({
  matchDays,
  selectedMatchDay,
  onSelectMatchDay
}) => {
  const isSelectedMatchDay = (matchDay) => matchDay.hasSame(selectedMatchDay, 'day');

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
