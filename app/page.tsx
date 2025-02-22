"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import useWebRTCAudioSession from "@/hooks/use-webrtc";
import AbbeyButton from "@/components/abbey-button";
import { videoSelector } from "@/lib/randomVideoSelector";

const App: React.FC = () => {
  // State for voice selection
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const preloadRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [latestUserStatement, setLatestUserStatement] = useState<string | null>(null);

  // WebRTC Audio Session Hook
  const { isSessionActive, handleStartStopClick, conversation, currentVolume } =
    useWebRTCAudioSession("alloy");

  const [videoSrc, setVideoSrc] = useState<string[]>(["/videos/bored.mp4","/videos/standingidle.mp4"]);
  const [videoIndex, setVideoIndex] = useState(0);

  const handleStartStopClickWithFullScreen = () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.controls = false;
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if ((videoElement as any).mozRequestFullScreen) {
        (videoElement as any).mozRequestFullScreen();
      } else if ((videoElement as any).webkitRequestFullscreen) {
        (videoElement as any).webkitRequestFullscreen();
      } else if ((videoElement as any).msRequestFullscreen) {
        (videoElement as any).msRequestFullscreen();
      }
    }
  };

  
  const volumeHistorySize = 2;
  const [volumeHistory, setVolumeHistory] = useState<number[]>([]);

  useEffect(() => {
    const threshold = 0.001;
    const silenceDuration = 50;

    setVolumeHistory((prev) => [...prev.slice(-volumeHistorySize + 1), currentVolume]);
    const avgVolume = volumeHistory.reduce((sum, v) => sum + v, 0) / (volumeHistory.length || 1);
    if (avgVolume > threshold) {
      if (!isSpeaking) {
        setIsSpeaking(true);
      }

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    } else {
      if (isSpeaking && !silenceTimeoutRef.current) {
        silenceTimeoutRef.current = setTimeout(() => {
          setIsSpeaking(false);
        }, silenceDuration);
      }
    }

    if (conversation.length > 0) {
      if (conversation[conversation.length - 1].role === "user") {
        setIsSpeaking(false);
      }
    }
  }, [currentVolume]);


  useEffect(() => {
    const text = conversation
    .filter((msg) => msg.role === "user" && msg.isFinal && msg.status === "final")
    .slice(-1)[0];

  if (text && text.text != latestUserStatement) {
    setLatestUserStatement((prev) => (prev !== text.text ? text.text : prev));
  }
  }, [conversation]);


  useEffect(() => {
    if (!videoRef.current) return;
    let newVideoSrc;

    if (isSessionActive) {
      newVideoSrc = isSpeaking
        ? videoSelector(latestUserStatement || "") 
        : ["/videos/listen.mp4"];   
    } else {
      newVideoSrc = ["/videos/bored.mp4", "/videos/standingidle.mp4"];
      setLatestUserStatement(null);
      setIsSpeaking(false);
      setVolumeHistory([]);
    }
  
    setVideoSrc(newVideoSrc);
    setVideoIndex(0);
  
    const videoElement = videoRef.current;
    videoElement.src = newVideoSrc[0];
    videoElement.load(); 
    videoElement.classList.add("fade-out");
        setTimeout(() => {
          videoElement.classList.remove("fade-out");
        }, 200);
    videoElement.play();
  }, [isSessionActive, isSpeaking]);
  



  //Video transition in same video src list
  useEffect(() => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.onended = () => {
        videoElement.classList.add("fade-out");
        setTimeout(() => {
          videoElement.classList.remove("fade-out");
        }, 200);
      };
    }
  });

    // Preload next video
    useEffect(() => {
      if (preloadRef.current) {
        const nextIndex = (videoIndex + 1) % videoSrc.length; 
        preloadRef.current.src = videoSrc[nextIndex];
        preloadRef.current.load();
      }
    }, [videoIndex, videoSrc]);

  return (
    <main className="h-full">
      <div className=" absolute">
        <AbbeyButton
          isSessionActive={isSessionActive}
          onClick={() => {
            handleStartStopClick();
            !isSessionActive && handleStartStopClickWithFullScreen();
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
      <video
          ref={videoRef}
          width="1080"
          height="1080"
          autoPlay
          muted
          preload="auto"
          onEnded={() => {
           
            const nextIndex = (videoIndex + 1) % videoSrc.length; 
            if (videoRef.current && preloadRef.current) {
              videoRef.current.src = preloadRef.current.src; 
              videoRef.current.play();
            }
            setVideoIndex(nextIndex);
          }}
        >
          <source src={videoSrc[videoIndex]} type="video/mp4" />
        </video>

        <video ref={preloadRef} style={{ display: "none" }} preload="auto" />
      
      </div>
    </main>
  );
};

export default App;
