import React from "react";

const Rank = ({ userName, entries }) => {
  return (
    <div className="tc">
      <div className="white f3">{`${userName}, your current entries is...`}</div>
      <div className="white f1">{entries}</div>
    </div>
  );
};

export default Rank;
