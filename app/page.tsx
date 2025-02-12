"use client";

import React, { use, useEffect, useRef, useState } from "react";
import useWebRTCAudioSession from "@/hooks/use-webrtc";
import AbbeyButton from "@/components/abbey-button";
import { getVideoFilePathsFromAI } from "@/lib/animationSelector";

const App: React.FC = () => {
  // State for voice selection
  const [voice, setVoice] = useState("alloy");
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // WebRTC Audio Session Hook
  const {
    isSessionActive,
    handleStartStopClick,
    msgs,
    conversation,
    currentVolume,
  } = useWebRTCAudioSession(voice);

  const [videoSrc, setVideoSrc] = useState<string[]>(["/videos/bored.mp4"]);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    const threshold = 0.0005;
    const silenceDuration = 1500;

    if (currentVolume > threshold) {
      if (!isSpeaking) {
        console.log("Assistant started speaking");
        setIsSpeaking(true);
      }

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    } else {
      if (isSpeaking && !silenceTimeoutRef.current) {
        silenceTimeoutRef.current = setTimeout(() => {
          console.log("Assistant finished speaking");
          setIsSpeaking(false);
        }, silenceDuration);
      }
    }
  }, [currentVolume]);

  useEffect(() => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      if (isSessionActive === false) {
        videoElement.classList.add("fade-out");
        setTimeout(() => {
          setVideoSrc(["/videos/bored.mp4", "/videos/standingidle.mp4"]);
          videoElement.classList.remove("fade-out");
        }, 400);
      } else {
        videoElement.classList.add("fade-out");
        setTimeout(() => {
          setVideoSrc(["/videos/listen.mp4"]);
          videoElement.classList.remove("fade-out");
        }, 400);
      }
    }
    console.log(videoSrc);
  }, [isSessionActive]);

  // useEffect(() => {
  //   if (isSpeaking && isSessionActive) {
  //     setVideoSrc(["/videos/talking2.mp4"]);
  //   } else if (!isSpeaking && isSessionActive) {
  //     setVideoSrc(["/videos/listen.mp4"]);
  //   }
  // }, [isSpeaking]);

  //Play video on load

  
  useEffect(() => {
    const videoElement = document.querySelector("video");

    if (videoElement) {
      videoElement.load();
      const prom = videoElement.play();

      if (prom !== undefined) {
        prom.then(() => {}).catch((error) => {});
      }
    }
  }, [videoSrc, videoIndex]);

  //Video transition in same video src list
  useEffect(() => {
    const videoElement = document.querySelector("video");

    if (videoElement) {
      videoElement.onended = () => {
        videoElement.classList.add("fade-out");
        setTimeout(() => {
          setVideoIndex((prevIndex) => (prevIndex + 1) % videoSrc.length);
          videoElement.classList.remove("fade-out");
        }, 400);
      };
    }
  });

  return (
    <main className="h-full">
      <div className=" absolute">
        <AbbeyButton
          isSessionActive={isSessionActive}
          onClick={handleStartStopClick}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <video width="1080" height="1080" autoPlay muted preload="auto">
          <source src={videoSrc[videoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </main>
  );
};

export default App;
