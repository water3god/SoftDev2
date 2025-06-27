"use client";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import clsx from "clsx";

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

  const handleClick = useCallback(() => {
    router.push(link);
  }, [link]);

  return (
    <button
      className={clsx("home-btn", {
        hovered: isHovered,
        clicked: isClicked,
      })}
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
