import { useState, useEffect } from 'react';
import { Droplet } from 'lucide-react';

interface Drop {
  id: string;
  x: number;
  y: number;
  speed: number;
}

export function WaterSavingGame() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [bucketPosition, setBucketPosition] = useState(50);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [missedDrops, setMissedDrops] = useState(0);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      const newDrop: Drop = {
        id: Date.now().toString(),
        x: Math.random() * 90 + 5,
        y: 0,
        speed: Math.random() * 2 + 2
      };
      setDrops(prev => [...prev, newDrop]);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setDrops(prev => {
        const updated = prev.map(drop => ({
          ...drop,
          y: drop.y + drop.speed
        }));

        // Check collisions
        updated.forEach(drop => {
          if (drop.y >= 85 && drop.y <= 95) {
            const bucketLeft = bucketPosition - 5;
            const bucketRight = bucketPosition + 5;
            if (drop.x >= bucketLeft && drop.x <= bucketRight) {
              setScore(s => s + 1);
              drop.y = 100; // Mark as caught
            }
          }
          if (drop.y > 95 && drop.y < 100) {
            setMissedDrops(m => {
              const newMissed = m + 1;
              if (newMissed >= 10) {
                setGameActive(false);
                setGameOver(true);
              }
              return newMissed;
            });
            drop.y = 100;
          }
        });

        return updated.filter(drop => drop.y < 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameActive, bucketPosition]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBucketPosition(Math.max(10, Math.min(90, x)));
  };

  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setScore(0);
    setMissedDrops(0);
    setDrops([]);
  };

  if (!gameActive && !gameOver) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center border-2 border-blue-200">
        <div className="text-6xl mb-6">💧</div>
        <h2 className="text-blue-600 mb-4">Salva las Gotas</h2>
        <p className="text-gray-600 mb-6">
          Mueve el balde con tu mouse para atrapar las gotas de agua.
          ¡No dejes que se desperdicien más de 10 gotas!
        </p>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md"
        >
          Comenzar Juego
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center border-2 border-blue-200">
        <h2 className="text-blue-600 mb-4">¡Juego Terminado!</h2>
        <div className="text-gray-800 mb-6">
          Gotas Salvadas: {score}
        </div>
        <p className="text-gray-600 mb-6">
          {score >= 50 
            ? '¡Increíble! Eres un guardián del agua.'
            : score >= 20
            ? '¡Bien hecho! Cada gota cuenta.'
            : '¡Sigue intentándolo! El agua es vida.'}
        </p>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md"
        >
          Jugar de Nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border-2 border-blue-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Droplet className="w-6 h-6 text-blue-600" />
          <h3 className="text-blue-600">Salva las Gotas</h3>
        </div>
        <div className="flex gap-4">
          <div className="text-gray-700">
            Salvadas: <span className="text-blue-600">{score}</span>
          </div>
          <div className="text-gray-700">
            Perdidas: <span className="text-red-600">{missedDrops}/10</span>
          </div>
        </div>
      </div>

      <div
        className="relative bg-gradient-to-b from-blue-100 to-blue-50 rounded-xl overflow-hidden border-2 border-blue-300"
        style={{ height: '500px' }}
        onMouseMove={handleMouseMove}
      >
        {/* Drops */}
        {drops.map(drop => (
          <div
            key={drop.id}
            className="absolute transition-all"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Droplet className="w-6 h-6 text-blue-500" fill="currentColor" />
          </div>
        ))}

        {/* Bucket */}
        <div
          className="absolute bottom-4 transition-all duration-100"
          style={{
            left: `${bucketPosition}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="w-20 h-16 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-b-xl border-4 border-orange-600 relative">
            <div className="absolute -top-2 left-0 right-0 h-2 bg-orange-600 rounded-t-sm"></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md border-2 border-blue-200">
          <p className="text-sm text-gray-600">Mueve el mouse para atrapar las gotas</p>
        </div>
      </div>
    </div>
  );
}
