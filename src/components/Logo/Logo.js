import React from "react";
import Tilt from "react-parallax-tilt";
import brain from "./brain.png";
import "./Logo.css";

const Logo = () => {
  return (
    <Tilt
      className="ma4 br2 shadow-2 linear-bg"
      style={{
        height: "150px",
        width: "150px",
        display: "inline-block",
        marginTop: "-3rem",
      }}
    >
      <div className="pa3">
        <img
          src={brain}
          alt="brain logo"
          style={{ paddingTop: "9px", paddingLeft: "9px" }}
        />
      </div>
    </Tilt>
  );
};

export default Logo;
