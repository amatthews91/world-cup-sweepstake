import React from 'react';

import './Error.css';

const Error = ({ message }) => (
  <div className = "error">
    { message }
  </div>
);

export default Error;
