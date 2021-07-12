import React, { useEffect, useState } from 'react';

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
    <div className="timeline"></div>
  );
};

export default Timeline;
