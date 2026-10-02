const VALUES = [8, 12, 14, 18, 22, 28, 36, 44, 52, 58, 70, 76, 84, 80, 92, 104, 112, 108, 120, 132, 146, 158, 172, 189];
const VOLUMES = [30, 48, 40, 70, 55, 90, 60, 110, 80, 50, 95, 120, 70, 85, 140, 60, 75, 100, 90, 130, 80, 150, 110, 170];
const WIDTH = 640;
const HEIGHT = 180;
const MAX = 200;

function point(index: number, value: number) {
  const x = (index / (VALUES.length - 1)) * WIDTH;
  const y = HEIGHT - (value / MAX) * (HEIGHT - 16) - 8;
  return { x, y };
}

const line = VALUES.map((value, index) => {
  const { x, y } = point(index, value);
  return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
}).join(" ");

const BUYS = [2, 7, 11, 15, 20];
const SELLS = [9, 13, 17];

export function GrowthChart() {
  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-52 w-full">
        <defs>
          <linearGradient id="pnlFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ee6ea" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2ee6ea" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((row) => (
          <line
            key={row}
            x1="0"
            x2={WIDTH}
            y1={20 + row * 40}
            y2={20 + row * 40}
            stroke="#2ee6ea"
            strokeOpacity="0.08"
          />
        ))}
        <path d={`${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`} fill="url(#pnlFill)" />
        <path d={line} fill="none" stroke="#2ee6ea" strokeWidth="2.4" />
        {BUYS.map((index) => {
          const { x, y } = point(index, VALUES[index]);
          return <circle key={`b-${index}`} cx={x} cy={y} r="4" fill="#3dffb0" />;
        })}
        {SELLS.map((index) => {
          const { x, y } = point(index, VALUES[index]);
          return <circle key={`s-${index}`} cx={x} cy={y} r="4" fill="#ff5d6c" />;
        })}
      </svg>
      <div className="mt-2 flex h-16 items-end gap-1">
        {VOLUMES.map((bar, index) => (
          <span
            key={index}
            className="flex-1 rounded-sm bg-cyan/70"
            style={{ height: `${(bar / 170) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-mist">
        {["Jan 1", "Feb 23", "Mar 30", "Apr 3", "Jul 18", "Aug 13", "Sep 19", "Oct 18"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
