export function Sparkline({
  values,
  className = "",
}: {
  values: number[];
  className?: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const coords = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 28 - ((value - min) / span) * 24;
    return [x, y] as const;
  });
  const line = coords
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={`${line} L100 32 L0 32 Z`} fill="currentColor" opacity="0.16" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
