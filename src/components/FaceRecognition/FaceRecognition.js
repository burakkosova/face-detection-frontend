import React from "react";
import "./FaceRecognition.css";

const createBox = (boxes) => {
  const items = [];
  boxes.forEach((box, i) => {
    items.push(
      <div
        key={i}
        className="bounding-box"
        style={{
          top: box.topRow,
          right: box.rightCol,
          bottom: box.bottomRow,
          left: box.leftCol,
        }}
      ></div>
    );
  });
  return items;
};

const FaceRecognition = ({ url, boxes }) => {
  return (
    <div className="justify-center ma">
      <div className="absolute mt2">
        <img
          id="input-image"
          alt=""
          src={url}
          width="500px"
          height="auto"
        ></img>
        {createBox(boxes)}
      </div>
    </div>
  );
};

export default FaceRecognition;
