"use client";
import Image from "next/image";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div>
      {/* Topbar */}
      <div className="topbar">
        <span>Trash Identifier</span>
        <button
          className={`home-btn${isHovered ? " hovered" : ""}${
            isClicked ? " clicked" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsClicked(true)}
          onMouseUp={() => setIsClicked(false)}
          onMouseOut={() => setIsClicked(false)}
        >
          Home
        </button>
      </div>
      {/* Main content */}
      <div style={{ padding: "24px" }}>{/* Main content goes here */}</div>
    </div>
  );
}
