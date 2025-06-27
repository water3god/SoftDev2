"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function TopbarButton({
  link,
  name,
}: Readonly<{
  link: string;
  name: string;
}>) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(link);
  };

  return (
    <button
      className={`home-btn${isHovered ? " hovered" : ""}${
        isClicked ? " clicked" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      onMouseOut={() => setIsClicked(false)}
      onClick={handleClick}
    >
      {name}
    </button>
  );
}

export default function Topbar() {
  return (
    <div className="topbar">
      <span>Trash Identifier</span>
      <div className="topbar-buttons">
        <TopbarButton name="Home" link={"/"} />
        <TopbarButton name="Vision" link={"/vision"} />
      </div>
    </div>
  );
}
