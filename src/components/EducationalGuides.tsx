import { useState } from 'react';
import { BookOpen, Recycle, Droplet, Zap } from 'lucide-react';
import { RecyclingGame } from './RecyclingGame';
//import { WaterSavingGame } from './WaterSavingGame';

export function EducationalGuides() {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guides = [
    {
      id: 'recycling',
      title: 'Clasificación de Residuos',
      icon: Recycle,
      color: 'from-green-400 to-green-600',
      description: 'Aprende a clasificar correctamente tus residuos',
      content: [
        {
          type: 'Orgánicos',
          color: 'bg-green-100 border-green-500',
          items: ['Restos de comida', 'Cáscaras de frutas', 'Residuos de jardín', 'Café y té'],
          icon: '🍎'
        },
        {
          type: 'Reciclables',
          color: 'bg-blue-100 border-blue-500',
          items: ['Papel y cartón', 'Plástico', 'Vidrio', 'Metal'],
          icon: '♻️'
        },
        {
          type: 'No Reciclables',
          color: 'bg-gray-100 border-gray-500',
          items: ['Pañales', 'Papel higiénico', 'Colillas', 'Residuos sanitarios'],
          icon: '🗑️'
        }
      ]
    },
    {
      id: 'tips',
      title: 'Consejos Ecológicos',
      icon: Zap,
      color: 'from-yellow-400 to-orange-600',
      description: 'Pequeñas acciones, gran impacto',
      content: [
        {
          tip: 'Reduce el uso de plástico',
          details: 'Usa bolsas reutilizables, botellas de agua recargables y evita productos de un solo uso.',
          icon: '🛍️'
        },
        {
          tip: 'Compostaje en casa',
          details: 'Convierte tus residuos orgánicos en abono natural para plantas.',
          icon: '🌱'
        },
        {
          tip: 'Compra consciente',
          details: 'Prefiere productos con menos embalaje y de empresas sostenibles.',
          icon: '🛒'
        },
        {
          tip: 'Reutiliza y repara',
          details: 'Antes de desechar, pregúntate si puedes reparar o darle un nuevo uso.',
          icon: '🔧'
        }
      ]
    },
    {
      id: 'impact',
      title: 'Impacto Ambiental',
      icon: Droplet,
      color: 'from-blue-400 to-cyan-600',
      description: 'Conoce el efecto de la contaminación',
      content: [
        {
          stat: '8 millones',
          label: 'Toneladas de plástico llegan al océano cada año',
          icon: '🌊'
        },
        {
          stat: '500 años',
          label: 'Puede tardar una botella de plástico en degradarse',
          icon: '⏳'
        },
        {
          stat: '70%',
          label: 'De los residuos pueden ser reciclados o compostados',
          icon: '♻️'
        },
        {
          stat: '1 millón',
          label: 'De aves marinas mueren anualmente por plástico',
          icon: '🐦'
        }
      ]
    }
  ];

  const games = [
    {
      id: 'recycling-game',
      title: 'Juego de Clasificación',
      icon: '🎮',
      component: RecyclingGame
    },
   /* {
      id: 'water-game',
      title: 'Salva las Gotas',
      icon: '💧',
      component: WaterSavingGame
    }*/
  ];

  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game) {
      const GameComponent = game.component;
      return (
        <div className="h-full overflow-y-auto bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-6 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors border-2 border-green-200"
            >
              ← Volver a Guías
            </button>
            <GameComponent />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-green-700 mb-2">Guías Educativas</h2>
          <p className="text-gray-600">
            Aprende sobre el manejo responsable de residuos
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <button
                key={guide.id}
                onClick={() => setSelectedGuide(selectedGuide === guide.id ? null : guide.id)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-green-100 text-left hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${guide.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-800 mb-2">{guide.title}</h3>
                <p className="text-gray-600 text-sm">{guide.description}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Guide Content */}
        {selectedGuide && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 mb-12">
            {selectedGuide === 'recycling' && (
              <div>
                <h3 className="text-green-700 mb-6">Guía de Clasificación</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {guides[0].content.map((category: any, index: number) => (
                    <div key={index} className={`${category.color} border-2 rounded-xl p-6`}>
                      <div className="text-4xl mb-3 text-center">{category.icon}</div>
                      <h4 className="text-gray-800 mb-3 text-center">{category.type}</h4>
                      <ul className="space-y-2">
                        {category.items.map((item: string, i: number) => (
                          <li key={i} className="text-gray-700 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedGuide === 'tips' && (
              <div>
                <h3 className="text-orange-600 mb-6">Consejos Prácticos</h3>
                <div className="space-y-4">
                  {guides[1].content.map((tip: any, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{tip.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-gray-800 mb-2">{tip.tip}</h4>
                          <p className="text-gray-600 text-sm">{tip.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedGuide === 'impact' && (
              <div>
                <h3 className="text-blue-600 mb-6">Datos Importantes</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {guides[2].content.map((stat: any, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                      <div className="text-5xl mb-3">{stat.icon}</div>
                      <div className="text-blue-600 mb-2">{stat.stat}</div>
                      <p className="text-gray-700 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interactive Games Section */}
        <div>
          <h3 className="text-green-700 mb-6 text-center">Juegos Interactivos</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-green-100 hover:border-green-300 hover:scale-105"
              >
                <div className="text-6xl mb-4 text-center">{game.icon}</div>
                <h4 className="text-gray-800 text-center">{game.title}</h4>
                <p className="text-green-600 text-sm text-center mt-2">Jugar ahora →</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
