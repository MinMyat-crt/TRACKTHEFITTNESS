import React from "react";
import "./Advertisement.css"; // Import CSS for styling
import Login from "./Login";

const Advertisement = ({ onLogin }) => {
  return (
    <div className="advertisement-container">
      <div className="advertisement-copy">
        <span className="advertisement-kicker">A clearer way to feel well</span>
        <h1 className="advertisement-title">Make progress visible.</h1>
        <p className="advertisement-description">
          A calm, practical space for the habits that shape your strongest days.
        </p>
        <div className="advertisement-section">
          <div className="advertisement-item">
            <img
              src="https://hips.hearstapps.com/hmg-prod/images/701/articles/2017/01/how-much-joining-gym-helps-health-2-jpg-1488906648.jpeg"
              alt="Person exercising"
              className="advertisement-image"
            />
            <p>Move with intention.</p>
          </div>
          <div className="advertisement-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL-AdJgfVZWFIfsYSvj12YvRqFjZohkzFZQQ&s"
              alt="Fresh nutritious meal"
              className="advertisement-image"
            />
            <p>Eat for the life you want.</p>
          </div>
        </div>
      </div>
      <div className="advertisement-login">
        <Login onLogin={onLogin} />
      </div>
    </div>
  );
};

export default Advertisement;
