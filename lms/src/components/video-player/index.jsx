import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Slider } from "../ui/slider";
import { Button } from "../ui/button";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayedTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  function handlePlayPause() {
    setPlaying(!playing);
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayedTime(state.played);
    }
  }

  function handleRewind() {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  }

  function handleFastForward() {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleSeekChange(newValue) {
    setPlayedTime(newValue[0]);
    setSeeking(true);
  }
  function handleSeekMouseUp() {
    setSeeking(false);
    playerRef.current.seekTo(played);
  }

  function handleVolumeChange(newVolume) {
    setVolume(newVolume);
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes().toString().padStart(2, "0");
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
      return `${hh}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({ ...progressData, progressValue: played });
    }
  }, [played]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out md:mx-auto 
    ${isFullScreen ? "w-full h-screen" : ""}
    `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width={"100%"}
        height={"100%"}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />
      {showControls ? (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={() => handleSeekMouseUp}
            className="w-full mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={handleRewind}
                size="icon"
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleFastForward}
                size="icon"
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleToggleMute}
                size="icon"
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange(value[0] / 100)}
                className="w-24 "
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white">
                {formatTime(played * (playerRef?.current?.getDuration() || 0))}{" "}
                / {formatTime(playerRef?.current?.getDuration() || 0)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default VideoPlayer;
