import { useState, useEffect } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  category: 'organic' | 'recyclable' | 'non-recyclable';
  emoji: string;
}

const items: Item[] = [
  { id: '1', name: 'Cáscara de Plátano', category: 'organic', emoji: '🍌' },
  { id: '2', name: 'Botella de Plástico', category: 'recyclable', emoji: '🍾' },
  { id: '3', name: 'Pañal Usado', category: 'non-recyclable', emoji: '🧷' },
  { id: '4', name: 'Lata de Refresco', category: 'recyclable', emoji: '🥫' },
  { id: '5', name: 'Restos de Comida', category: 'organic', emoji: '🍽️' },
  { id: '6', name: 'Papel de Periódico', category: 'recyclable', emoji: '📰' },
  { id: '7', name: 'Colilla de Cigarro', category: 'non-recyclable', emoji: '🚬' },
  { id: '8', name: 'Cáscaras de Huevo', category: 'organic', emoji: '🥚' },
];

export function RecyclingGame() {
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [usedItems, setUsedItems] = useState<string[]>([]);

  useEffect(() => {
    selectNewItem();
  }, []);

  const selectNewItem = () => {
    const availableItems = items.filter(item => !usedItems.includes(item.id));
    if (availableItems.length === 0) {
      setGameOver(true);
      return;
    }
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    setCurrentItem(randomItem);
    setFeedback(null);
  };

  const handleChoice = (category: 'organic' | 'recyclable' | 'non-recyclable') => {
    if (!currentItem) return;

    if (currentItem.category === category) {
      setScore(score + 10);
      setFeedback({ type: 'correct', message: '¡Correcto! +10 puntos' });
      setUsedItems([...usedItems, currentItem.id]);
      setTimeout(() => selectNewItem(), 1500);
    } else {
      setLives(lives - 1);
      setFeedback({ type: 'incorrect', message: 'Incorrecto. Intenta de nuevo.' });
      if (lives <= 1) {
        setGameOver(true);
      } else {
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setUsedItems([]);
    selectNewItem();
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center border-2 border-green-200">
        <h2 className="text-green-700 mb-4">¡Juego Terminado!</h2>
        <div className="text-gray-800 mb-6">
          Puntuación Final: {score} puntos
        </div>
        <p className="text-gray-600 mb-6">
          {score >= 50 
            ? '¡Excelente trabajo! Eres un experto en clasificación de residuos.'
            : score >= 30
            ? '¡Buen intento! Sigue practicando para mejorar.'
            : '¡No te rindas! La práctica hace al maestro.'}
        </p>
        <button
          onClick={resetGame}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
        >
          Jugar de Nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border-2 border-green-200">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-green-600" />
            <h3 className="text-green-700">Juego de Clasificación</h3>
          </div>
          <div className="flex gap-4">
            <div className="text-gray-700">
              Puntos: <span className="text-green-600">{score}</span>
            </div>
            <div className="text-gray-700">
              Vidas: <span className="text-red-600">{'❤️'.repeat(lives)}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Clasifica correctamente los residuos en la caneca correspondiente
        </p>
      </div>

      {/* Current Item */}
      {currentItem && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 mb-6 text-center border-2 border-green-200">
          <div className="text-8xl mb-4">{currentItem.emoji}</div>
          <h4 className="text-gray-800">{currentItem.name}</h4>
          <p className="text-gray-600 text-sm mt-2">¿En qué caneca lo clasificarías?</p>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          feedback.type === 'correct' 
            ? 'bg-green-100 border-2 border-green-500' 
            : 'bg-red-100 border-2 border-red-500'
        }`}>
          {feedback.type === 'correct' ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <p className={feedback.type === 'correct' ? 'text-green-700' : 'text-red-700'}>
            {feedback.message}
          </p>
        </div>
      )}

      {/* Bins */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => handleChoice('organic')}
          className="bg-green-100 border-2 border-green-500 rounded-xl p-6 hover:bg-green-200 transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-5xl mb-3">🍎</div>
          <h4 className="text-gray-800 mb-2">Orgánicos</h4>
          <p className="text-gray-600 text-sm">Restos de comida y jardín</p>
        </button>

        <button
          onClick={() => handleChoice('recyclable')}
          className="bg-blue-100 border-2 border-blue-500 rounded-xl p-6 hover:bg-blue-200 transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-5xl mb-3">♻️</div>
          <h4 className="text-gray-800 mb-2">Reciclables</h4>
          <p className="text-gray-600 text-sm">Papel, plástico, vidrio</p>
        </button>

        <button
          onClick={() => handleChoice('non-recyclable')}
          className="bg-gray-100 border-2 border-gray-500 rounded-xl p-6 hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-5xl mb-3">🗑️</div>
          <h4 className="text-gray-800 mb-2">No Reciclables</h4>
          <p className="text-gray-600 text-sm">Residuos sanitarios</p>
        </button>
      </div>
    </div>
  );
}
