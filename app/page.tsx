"use client";

import React, { useEffect, useState } from "react";
import useWebRTCAudioSession from "@/hooks/use-webrtc";
import AbbeyButton from "@/components/abbey-button";

const App: React.FC = () => {
  // State for voice selection
  const [voice, setVoice] = useState("alloy");

  // WebRTC Audio Session Hook
  const {isSessionActive, handleStartStopClick, msgs, conversation } =
    useWebRTCAudioSession(voice);

    const [videoSrc, setVideoSrc] = useState("/videos/bored.mp4");

  useEffect(() => {
    if (isSessionActive === false) {
      setVideoSrc("/videos/bored.mp4");
    } else {
      setVideoSrc("/videos/listen.mp4");
    }
  }, [isSessionActive]);

  useEffect(() => {
    if(conversation.length > 0){
      if(conversation[conversation.length - 1].role === "user" && (conversation[conversation.length - 1].status == "processing" || conversation[conversation.length - 1].status == "speaking")){
        setVideoSrc("/videos/listen.mp4");
      }
      else{
        setVideoSrc("/videos/talking.mp4");
      }
    }
  },[conversation]);

  

  useEffect(() => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.load(); 

      const prom = videoElement.play();
      if (prom !== undefined) {
        prom.then(() => {
          console.log("Video is playing");
        }).catch((error) => {
          console.error("Error playing video", error);
        });
      }
    }
  }, [videoSrc]);

  return (
    <main className="h-full">
      <div className="flex flex-col items-center gap-4">
        <AbbeyButton
          isSessionActive={isSessionActive}
          onClick={handleStartStopClick}
        />
        <video width="850" height="850" loop autoPlay muted preload="auto">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </main>
  );
};

export default App;
