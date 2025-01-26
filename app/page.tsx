"use client"

import React, { useEffect, useState } from "react"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import AbbeyButton from "@/components/abbey-button"

const App: React.FC = () => {
  // State for voice selection
  const [voice, setVoice] = useState("alloy")

  // WebRTC Audio Session Hook
  const {
    status,
    isSessionActive,
    handleStartStopClick,
    msgs,
    conversation,
  } = useWebRTCAudioSession(voice)

  // Get all tools functions


  return (
    <main className="h-full">
      
          <div className="flex flex-col items-center gap-4">
            <AbbeyButton 
              isSessionActive={isSessionActive} 
              onClick={handleStartStopClick}
              status={status}
            />
          </div>
       
  

    </main>
  )
}

export default App;