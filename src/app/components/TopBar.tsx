"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Topbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/vision");
  };

  return (
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
        onClick={handleHomeClick}
      >
        Home
      </button>
    </div>
  );
}
