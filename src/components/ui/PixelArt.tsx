interface PixelArtProps {
  rows: string[];
  pixel?: number;
  label?: string;
  className?: string;
}

export default function PixelArt({ rows, pixel = 4, label, className }: PixelArtProps) {
  const width = rows[0]?.length ?? 0;
  const height = rows.length;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width * pixel}
      height={height * pixel}
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      {rows.map((row, y) =>
        [...row].map((cell, x) =>
          cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" /> : null,
        ),
      )}
    </svg>
  );
}
