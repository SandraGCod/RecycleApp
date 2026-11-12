import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';

// Código de colores de canecas usado en Colombia
type Caneca = 'verde' | 'blanca' | 'negra';

interface Residuo {
  id: string;
  nombre: string;
  emoji: string;
  caneca: Caneca;
  pista: string;
}

const RESIDUOS: Residuo[] = [
  { id: '1', nombre: 'Cáscara de plátano', emoji: '🍌', caneca: 'verde', pista: 'Los restos de fruta se descomponen y pueden volverse abono.' },
  { id: '2', nombre: 'Botella de plástico', emoji: '🍾', caneca: 'blanca', pista: 'Vacía y limpia, el plástico se puede reciclar.' },
  { id: '3', nombre: 'Pañal usado', emoji: '🧷', caneca: 'negra', pista: 'Los residuos sanitarios no se pueden aprovechar.' },
  { id: '4', nombre: 'Lata de gaseosa', emoji: '🥫', caneca: 'blanca', pista: 'El metal se recicla muchas veces sin perder calidad.' },
  { id: '5', nombre: 'Restos de comida', emoji: '🍽️', caneca: 'verde', pista: 'Los restos de comida son residuos orgánicos aprovechables.' },
  { id: '6', nombre: 'Periódico seco', emoji: '📰', caneca: 'blanca', pista: 'El papel limpio y seco se recicla; si está mojado o sucio, no.' },
  { id: '7', nombre: 'Colilla de cigarrillo', emoji: '🚬', caneca: 'negra', pista: 'Tiene filtro de plástico y químicos: no se puede reciclar.' },
  { id: '8', nombre: 'Cáscaras de huevo', emoji: '🥚', caneca: 'verde', pista: 'Se descomponen y aportan calcio al compost.' },
];

const CANECAS: Record<
  Caneca,
  { nombre: string; detalle: string; cuerpo: string; tapa: string; borde: string; placa: string; texto: string }
> = {
  verde: {
    nombre: 'Verde',
    detalle: 'Orgánicos',
    cuerpo: '#1E7B4B',
    tapa: '#145C38',
    borde: '#145C38',
    placa: 'rgba(255,255,255,0.16)',
    texto: 'text-white',
  },
  blanca: {
    nombre: 'Blanca',
    detalle: 'Aprovechables',
    cuerpo: '#FFFFFF',
    tapa: '#D3DAD5',
    borde: '#AEB9B1',
    placa: 'rgba(23,40,31,0.07)',
    texto: 'text-tinta',
  },
  negra: {
    nombre: 'Negra',
    detalle: 'No aprovechables',
    cuerpo: '#2A2D31',
    tapa: '#17191C',
    borde: '#17191C',
    placa: 'rgba(255,255,255,0.14)',
    texto: 'text-white',
  },
};

/** Dibujo de una caneca: asa, tapa que sobresale y cuerpo que se angosta hacia abajo */
function CanecaDibujo({
  config,
  abierta,
}: {
  config: (typeof CANECAS)[Caneca];
  abierta: boolean;
}) {
  return (
    <svg viewBox="0 0 100 124" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* Cuerpo */}
      <path
        d="M13 28 H87 L80 114 Q79.6 118 75.5 118 H24.5 Q20.4 118 20 114 Z"
        fill={config.cuerpo}
        stroke={config.borde}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Placa donde va el nombre */}
      <rect x="20" y="52" width="60" height="26" rx="6" fill={config.placa} />
      {/* Tapa con asa: se levanta cuando aciertas */}
      <g
        className="motion-safe:transition-transform motion-safe:duration-300"
        style={{
          transformOrigin: '92px 26px',
          transform: abierta ? 'rotate(-14deg)' : 'rotate(0deg)',
        }}
      >
        <rect x="38" y="3" width="24" height="10" rx="5" fill={config.tapa} stroke={config.borde} strokeWidth="1.5" />
        <rect x="5" y="11" width="90" height="17" rx="7" fill={config.tapa} stroke={config.borde} strokeWidth="1.5" />
      </g>
    </svg>
  );
}

const ORDEN_CANECAS: Caneca[] = ['verde', 'blanca', 'negra'];
const INTENTOS = 3;
const PUNTOS_POR_ACIERTO = 10;

function barajar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function RecyclingGame() {
  const [orden, setOrden] = useState(() => barajar(RESIDUOS));
  const [indice, setIndice] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [intentos, setIntentos] = useState(INTENTOS);
  const [descartadas, setDescartadas] = useState<Caneca[]>([]); // canecas ya probadas
  const [acertado, setAcertado] = useState(false);
  const [terminado, setTerminado] = useState(false);

  const residuo = orden[indice];
  const esUltimo = indice === orden.length - 1;
  const sinIntentos = intentos === 0;
  const puntajeMaximo = orden.length * PUNTOS_POR_ACIERTO;

  const elegir = (caneca: Caneca) => {
    if (acertado || terminado) return;

    if (caneca === residuo.caneca) {
      setPuntos((p) => p + PUNTOS_POR_ACIERTO);
      setAcertado(true);
      return;
    }

    const quedan = intentos - 1;
    setIntentos(quedan);
    setDescartadas((d) => [...d, caneca]);
    if (quedan === 0) setTerminado(true);
  };

  const siguiente = () => {
    if (esUltimo) {
      setTerminado(true);
      return;
    }
    setIndice((i) => i + 1);
    setAcertado(false);
    setDescartadas([]);
  };

  const reiniciar = () => {
    setOrden(barajar(RESIDUOS));
    setIndice(0);
    setPuntos(0);
    setIntentos(INTENTOS);
    setDescartadas([]);
    setAcertado(false);
    setTerminado(false);
  };

  /* ---------- Pantalla final ---------- */
  if (terminado) {
    const proporcion = puntos / puntajeMaximo;
    const mensaje =
      proporcion >= 0.8
        ? 'Separas muy bien. Aplica lo mismo en tu casa.'
        : proporcion >= 0.5
        ? 'Vas bien. Repasa los colores de las canecas y vuelve a intentarlo.'
        : 'Repasa la guía de clasificación y prueba otra vez.';

    return (
      <section className="rounded-3xl border border-tinta/10 bg-white p-6 sm:p-8">
        <h3>{sinIntentos ? 'Se acabaron los intentos' : 'Terminaste la ronda'}</h3>

        <p className="mt-6 font-display text-6xl font-bold leading-none">
          {puntos}
          <span className="ml-2 text-2xl font-medium text-tinta/50">de {puntajeMaximo} puntos</span>
        </p>

        <p className="mt-6 text-tinta/80">{mensaje}</p>

        {sinIntentos && (
          <p className="mt-4 rounded-xl bg-campo p-4 text-sm leading-relaxed">
            <strong className="font-semibold">{residuo.nombre}</strong> va en la caneca{' '}
            {CANECAS[residuo.caneca].nombre.toLowerCase()}. {residuo.pista}
          </p>
        )}

        <button
          type="button"
          onClick={reiniciar}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-tinta px-6 font-semibold text-white transition-colors hover:bg-tinta/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-senal/70 sm:w-auto"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          Jugar de nuevo
        </button>
      </section>
    );
  }

  /* ---------- Juego ---------- */
  const ultimaFallida = descartadas[descartadas.length - 1];

  return (
    <section className="rounded-3xl border border-tinta/10 bg-white p-5 sm:p-8">
      <header>
        <h3>¿En qué caneca va?</h3>
        <p className="mt-1 text-sm text-tinta/70">Toca la caneca donde va cada residuo.</p>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-medium">
            Residuo {indice + 1} de {orden.length}
          </span>
          <span className="font-semibold">{puntos} puntos</span>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div
            className="flex flex-1 gap-1"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={orden.length}
            aria-valuenow={indice + (acertado ? 1 : 0)}
            aria-label="Progreso de la ronda"
          >
            {orden.map((r, i) => (
              <span
                key={r.id}
                className={`h-1.5 flex-1 rounded-full ${
                  i < indice || (i === indice && acertado)
                    ? 'bg-tinta'
                    : i === indice
                    ? 'bg-senal'
                    : 'bg-tinta/15'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5" role="img" aria-label={`Te quedan ${intentos} intentos`}>
            {Array.from({ length: INTENTOS }).map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full border-2 border-tinta ${i < intentos ? 'bg-tinta' : 'bg-transparent opacity-40'}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Residuo actual */}
      <div
        className={`mt-6 rounded-2xl bg-campo px-4 py-8 text-center transition-shadow ${
          acertado ? 'ring-2 ring-verde' : ''
        }`}
      >
        <div className="text-7xl leading-none" aria-hidden="true">
          {residuo.emoji}
        </div>
        <h4 className="mt-4 text-2xl">{residuo.nombre}</h4>
      </div>

      {/* Canecas */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {ORDEN_CANECAS.map((clave) => {
          const caneca = CANECAS[clave];
          const probada = descartadas.includes(clave);
          const bloqueada = acertado || probada;
          const esLaCorrecta = acertado && clave === residuo.caneca;

          return (
            <button
              key={clave}
              type="button"
              onClick={() => elegir(clave)}
              disabled={bloqueada}
              aria-label={`Caneca ${caneca.nombre.toLowerCase()}: ${caneca.detalle}`}
              className={`flex flex-col items-center rounded-2xl p-1 transition-transform active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-senal/70 disabled:cursor-not-allowed ${
                bloqueada && !esLaCorrecta ? 'opacity-40' : ''
              } ${clave === ultimaFallida && !acertado ? 'motion-safe:animate-sacudir' : ''} ${
                esLaCorrecta ? 'ring-4 ring-senal' : ''
              }`}
            >
              <span className="relative block aspect-[100/124] w-full max-w-[96px]">
                <CanecaDibujo config={caneca} abierta={esLaCorrecta} />
                <span
                  className={`absolute inset-x-0 flex items-center justify-center font-display text-[13px] font-semibold ${caneca.texto}`}
                  style={{ top: '42%', height: '21%' }}
                >
                  {caneca.nombre}
                </span>
              </span>
              <span className="mt-2 text-center text-xs font-medium leading-snug text-tinta/80">
                {caneca.detalle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Retroalimentación */}
      <div className="mt-4 empty:mt-0" aria-live="polite">
        {acertado ? (
          <div className="flex items-start gap-3 rounded-xl bg-verde/10 p-4">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-verde" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold">
                Va en la caneca {CANECAS[residuo.caneca].nombre.toLowerCase()}.
              </p>
              <p className="mt-1 text-sm text-tinta/80">{residuo.pista}</p>
            </div>
          </div>
        ) : descartadas.length > 0 ? (
          <p className="rounded-xl bg-alerta/10 p-4 text-sm font-medium text-alerta">
            No va en la caneca {CANECAS[ultimaFallida].nombre.toLowerCase()}. Prueba con otra: te quedan{' '}
            {intentos} {intentos === 1 ? 'intento' : 'intentos'}.
          </p>
        ) : null}
      </div>

      {acertado && (
        <button
          type="button"
          onClick={siguiente}
          className="mt-3 min-h-12 w-full rounded-xl bg-tinta px-6 font-semibold text-white transition-colors hover:bg-tinta/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-senal/70"
        >
          {esUltimo ? 'Ver resultado' : 'Siguiente residuo'}
        </button>
      )}

    </section>
  );
}
