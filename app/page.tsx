"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import useWebRTCAudioSession from "@/hooks/use-webrtc";
import AbbeyButton from "@/components/abbey-button";
import { videoSelector } from "@/lib/randomVideoSelector";

const App: React.FC = () => {
  // State for voice selection
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // WebRTC Audio Session Hook
  const { isSessionActive, handleStartStopClick, conversation, currentVolume } =
    useWebRTCAudioSession("alloy");

  const [videoSrc, setVideoSrc] = useState<string[]>(["/videos/bored.mp4"]);
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

  // volume bug here
  useEffect(() => {
    const threshold = 0.0005;
    const silenceDuration = 900;

    if (currentVolume > threshold) {
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
  }, [currentVolume, conversation]);

  const latestFinalUserMessage = useMemo(() => {
    return conversation
      .filter(
        (msg) =>
          msg.role === "user" && msg.isFinal && msg.status !== "processing"
      )
      .slice(-1)[0];
  }, [conversation]);

  useEffect(() => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      if (isSessionActive === false) {
        videoElement.classList.add("fade-out");
        setTimeout(() => {
          setVideoSrc(["/videos/bored.mp4", "/videos/standingidle.mp4"]);
          setVideoIndex(0);
          videoElement.classList.remove("fade-out");
        }, 400);
      } else {
        if (isSpeaking) {
          setTimeout(() => {
            if (latestFinalUserMessage === undefined) return;
            const paths = videoSelector(latestFinalUserMessage.text);
            videoElement.classList.add("fade-out");
            setVideoSrc(paths || videoSrc);
            setVideoIndex(0);
            videoElement.classList.remove("fade-out");
          }, 400);
        } else {
          videoElement.classList.add("fade-out");
          setTimeout(() => {
            setVideoSrc(["/videos/listen.mp4", "/videos/listen.mp4"]);
            setVideoIndex(0);
            videoElement.classList.remove("fade-out");
          }, 400);
        }
      }
    }
  }, [isSessionActive, latestFinalUserMessage, isSpeaking]);

  //Play video on load
  useEffect(() => {
    const videoElement = document.querySelector("video");

    if (videoElement) {
      videoElement.load();
      const prom = videoElement.play();

      if (prom !== undefined) {
        prom.then(() => {}).catch(() => {});
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
          onClick={() => {
            handleStartStopClick();
            !isSessionActive && handleStartStopClickWithFullScreen();
          }}
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
