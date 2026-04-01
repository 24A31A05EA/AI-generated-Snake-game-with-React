
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Trophy, Play, RotateCcw, Pause } from 'lucide-react';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus('PLAYING');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prevSpeed => Math.max(MIN_SPEED, prevSpeed - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (status === 'PLAYING') setStatus('PAUSED');
          else if (status === 'PAUSED') setStatus('PLAYING');
          else if (status === 'IDLE' || status === 'GAME_OVER') resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  useEffect(() => {
    if (status === 'PLAYING') {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black border-glitch shadow-none">
      <div className="flex justify-between w-full px-4">
        <div className="flex flex-col">
          <span className="text-sm uppercase tracking-widest text-[#0ff]/60 font-glitch">DATA_SCORE</span>
          <span className="text-5xl font-black text-[#0ff] font-glitch glitch-text drop-shadow-[0_0_5px_#0ff]" data-text={score}>{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm uppercase tracking-widest text-[#f0f]/60 font-glitch">MAX_RECORD</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#f0f]" />
            <span className="text-5xl font-black text-[#f0f] font-glitch glitch-text drop-shadow-[0_0_5px_#f0f]" data-text={highScore}>{highScore}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-[#000] border-2 border-[#0ff] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-500" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`transition-all duration-150 ${
              i === 0 
                ? 'bg-[#0ff] shadow-[0_0_10px_#0ff] z-10' 
                : 'bg-[#0ff]/40 border border-[#0ff]/20'
            }`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="bg-[#f0f] shadow-[0_0_10px_#f0f] animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        {status !== 'PLAYING' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            {status === 'IDLE' && (
              <button 
                onClick={resetGame}
                className="group flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 bg-[#0ff] flex items-center justify-center border-glitch group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-black fill-current" />
                </div>
                <span className="text-[#0ff] font-glitch tracking-widest uppercase text-lg">INITIALIZE_CORE</span>
              </button>
            )}
            {status === 'PAUSED' && (
              <button 
                onClick={() => setStatus('PLAYING')}
                className="group flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 bg-[#f0f] flex items-center justify-center border-glitch group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-black fill-current" />
                </div>
                <span className="text-[#f0f] font-glitch tracking-widest uppercase text-lg">RESUME_STREAM</span>
              </button>
            )}
            {status === 'GAME_OVER' && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-5xl font-black text-[#f0f] tracking-tighter uppercase glitch-text" data-text="SYSTEM_CRASH">SYSTEM_CRASH</h2>
                <button 
                  onClick={resetGame}
                  className="group flex flex-col items-center gap-4 cursor-pointer"
                >
                  <div className="w-16 h-16 bg-[#f0f] flex items-center justify-center border-glitch group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-8 h-8 text-black" />
                  </div>
                  <span className="text-[#f0f] font-glitch tracking-widest uppercase text-lg">REBOOT_SYSTEM</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8 text-sm font-glitch text-[#0ff]/40 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-[#0ff]/10 border border-[#0ff]/20 text-[#0ff]">NAV_ARROWS</kbd>
          <span>VECTOR_INPUT</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-[#f0f]/10 border border-[#f0f]/20 text-[#f0f]">SPACE_BAR</kbd>
          <span>INTERRUPT_SIGNAL</span>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
