const CYAN = [20, 24, 22, 30, 28, 36, 40, 38, 48, 44, 52, 60, 58, 70, 66, 78, 88, 96];
const AMBER = [18, 20, 19, 26, 24, 30, 34, 32, 40, 36, 42, 48, 46, 55, 52, 60, 68, 74];
const WIDTH = 640;
const HEIGHT = 220;
const MAX = 120;

function series(values: number[]) {
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * WIDTH;
      const y = HEIGHT - (value / MAX) * (HEIGHT - 24) - 12;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function DeckChart() {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mt-2 h-56 w-full">
      {Array.from({ length: 28 }, (_, index) => (
        <line
          key={index}
          x1={(index / 27) * WIDTH}
          x2={(index / 27) * WIDTH}
          y1={HEIGHT - 8 - ((index * 17) % 48)}
          y2={HEIGHT - 8}
          stroke="#2ee6ea"
          strokeOpacity="0.08"
        />
      ))}
      <path d={series(AMBER)} fill="none" stroke="#f5b942" strokeWidth="2.2" />
      <path d={series(CYAN)} fill="none" stroke="#2ee6ea" strokeWidth="2.4" />
    </svg>
  );
}
