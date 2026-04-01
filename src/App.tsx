import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Activity, Music, Gamepad2, Zap, Disc, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000] text-[#0ff] font-glitch selection:bg-[#f0f] selection:text-[#000]">
      {/* CRT Overlay & Scanlines */}
      <div className="crt-overlay" />
      <div className="scanline" />
      <div className="static-noise" />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center gap-12">
        {/* Header */}
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-3 px-4 py-1.5 border-glitch bg-black/80">
            <Terminal className="w-4 h-4 text-[#f0f] animate-pulse" />
            <span className="text-sm uppercase tracking-[0.3em] text-[#0ff]">CONNECTION_ESTABLISHED // NODE_77-X</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase">
            <span className="glitch-text block" data-text="NEON">
              NEON
            </span>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Music className="w-12 h-12 md:w-20 md:h-20 text-[#f0f] drop-shadow-[0_0_10px_#f0f] animate-pulse" />
              <Gamepad2 className="w-12 h-12 md:w-20 md:h-20 text-[#0ff] drop-shadow-[0_0_10px_#0ff] animate-bounce" />
              <Zap className="w-12 h-12 md:w-20 md:h-20 text-[#f0f] drop-shadow-[0_0_10px_#f0f] animate-pulse" />
              <Activity className="w-12 h-12 md:w-20 md:h-20 text-[#0ff] drop-shadow-[0_0_10px_#0ff]" />
              <Disc className="w-12 h-12 md:w-20 md:h-20 text-[#f0f] drop-shadow-[0_0_10px_#f0f] animate-spin" />
            </div>
            <span className="glitch-text block text-[#f0f]" data-text="RHYTHM">
              RHYTHM
            </span>
          </h1>
        </header>

        {/* Game Section */}
        <section className="w-full flex flex-col items-center gap-12">
          <div className="p-2 border-glitch bg-black/60">
            <SnakeGame />
          </div>
          
          <div className="w-full flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 w-full max-w-md">
              <div className="h-[2px] flex-1 bg-[#f0f]" />
              <span className="text-sm uppercase tracking-[0.5em] text-[#0ff]">SIGNAL_DECODER</span>
              <div className="h-[2px] flex-1 bg-[#f0f]" />
            </div>
            <div className="p-2 border-glitch bg-black/60">
              <MusicPlayer />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#f0f]/60">
            [SYSTEM_LOG: DATA_CORRUPTION_DETECTED // PROCEED_WITH_CAUTION]
          </p>
          <div className="flex justify-center gap-4 text-[#0ff]/20">
            <div className="w-2 h-2 bg-current animate-ping" />
            <div className="w-2 h-2 bg-current animate-ping delay-100" />
            <div className="w-2 h-2 bg-current animate-ping delay-200" />
          </div>
        </footer>
      </main>
    </div>
  );
}
