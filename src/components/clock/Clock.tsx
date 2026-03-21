"use client"

import React, { useState, useEffect } from "react";
import "./clock.css";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  const getTimeString = (value: Date) => {
    // show the colon for two seconds, then hide for one second
    // there's probably a better way to do this but i wanted to show the clock was "running"
    const showColon = value.getSeconds() % 3 !== 2;
    const formatted = value.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" });
    if (showColon) {
      return formatted.replace(':', ' ');
    }
    return formatted;
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="clock">
        <div className="clock-container">
          <p>{time.toLocaleDateString('en-US', { month: "numeric", day: "numeric" })} {getTimeString(time)}</p>
        </div>
      </section>
    </>
  );
}
