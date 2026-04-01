
import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black border-glitch p-6 shadow-none">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0 border-2 border-[#f0f]">
          <div className={`absolute inset-0 bg-[#f0f]/20 ${isPlaying ? 'animate-pulse' : ''}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className={`w-10 h-10 text-[#f0f] ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-[#0ff] truncate glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#f0f]/80 text-sm font-glitch uppercase tracking-wider truncate">
            SOURCE: {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="relative h-2 bg-[#0ff]/10 border border-[#0ff]/20 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#0ff] shadow-[0_0_10px_#0ff] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs font-glitch text-[#0ff]/40 uppercase tracking-widest">
          <span>TIME_ELAPSED: {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>TOTAL_LEN: {formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-[#0ff]/60 hover:text-[#f0f] transition-colors"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-14 h-14 bg-[#0ff] flex items-center justify-center hover:scale-105 transition-transform border-glitch"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-black fill-current" />
            ) : (
              <Play className="w-6 h-6 text-black fill-current ml-1" />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="p-2 text-[#0ff]/60 hover:text-[#f0f] transition-colors"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#f0f]/40">
          <Volume2 className="w-4 h-4" />
          <div className="w-16 h-1 bg-[#f0f]/10">
            <div className="w-2/3 h-full bg-[#f0f]/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
