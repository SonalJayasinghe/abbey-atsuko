"use client";

import React from "react";

interface AbbeyButtonProps {
    isSessionActive: boolean,
    onClick: () => void
  }


export default function AbbeyButton({ isSessionActive, onClick }: AbbeyButtonProps) {

  
  const getButtonText = () => {
    if (!isSessionActive) return "Start Session";
    return "Stop Session";
  };

  const buttonStyle = () => {
    if (!isSessionActive) return "bg-green-500 hover:bg-green-600";
    return "bg-red-500 hover:bg-red-600";
  }


  return (
    <button
      className={`px-4 py-2 text-white font-bold rounded-lg transition-all duration-300 ${buttonStyle()}`}
      onClick={onClick}
    >
      {getButtonText()}
    </button>
  );
}
