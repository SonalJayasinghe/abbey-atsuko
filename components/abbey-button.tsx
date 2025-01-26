"use client";

import React, { useState } from "react";
import useWebRTCAudioSession from "@/hooks/use-webrtc";

interface AbbeyButtonProps {
    isSessionActive: boolean,
    status: string,
    onClick: () => void
  }


export default function AbbeyButton({ isSessionActive, onClick,status }: AbbeyButtonProps) {

  
  const getButtonText = () => {
    if (!isSessionActive) return "Start Session";
    if (status.includes("speaking")) return "User Speaking...";
    if (status.includes("processing")) return "AI Processing...";
    return "Stop Session";
  };

  return (
    <button
      className={`px-4 py-2 text-white font-bold rounded-lg transition-all duration-300`}
      onClick={onClick}
    >
      {getButtonText()}
    </button>
  );
}
