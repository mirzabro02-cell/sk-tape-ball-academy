import { useState } from 'react';

export interface BarDatum {
  label: string;
  value: number;
  secondaryValue?: number;
}

export function AdminBarChart({
  data,
  primaryLabel = 'Applications (Demo)',
  secondaryLabel,
}: {
  data: BarDatum[];
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(
    1,
    ...data.flatMap((d) => [d.value, d.secondaryValue ?? 0]),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#071A36]">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#071A36]" />
            <span>{primaryLabel}</span>
          </span>
          {secondaryLabel && (
            <span className="inline-flex items-center gap-1.5 font-medium text-[#071A36]">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#D9A52E]" />
              <span>{secondaryLabel}</span>
            </span>
          )}
        </div>
        {hoveredIdx !== null && data[hoveredIdx] && (
          <span className="font-mono text-xs font-semibold text-[#071A36] tabular-nums">
            {data[hoveredIdx].label}: {data[hoveredIdx].value}
            {data[hoveredIdx].secondaryValue !== undefined
              ? ` / ${data[hoveredIdx].secondaryValue}`
              : ''}
          </span>
        )}
      </div>

      <div
        className="grid items-end gap-3 rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA]/70 px-4 pt-6 pb-3 h-52"
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`${primaryLabel} bar chart`}
      >
        {data.map((item, idx) => {
          const primaryPct = Math.round((item.value / maxVal) * 100);
          const secondaryPct =
            item.secondaryValue !== undefined
              ? Math.round((item.secondaryValue / maxVal) * 100)
              : 0;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex h-full flex-col items-center justify-end gap-2 group"
            >
              <div className="flex w-full flex-1 items-end justify-center gap-1.5">
                <div
                  className="w-full max-w-[20px] rounded-t-[4px] bg-[#071A36] transition-opacity group-hover:opacity-85"
                  style={{ height: `${Math.max(8, primaryPct)}%` }}
                  title={`${item.label}: ${item.value}`}
                />
                {item.secondaryValue !== undefined && (
                  <div
                    className="w-full max-w-[20px] rounded-t-[4px] bg-[#D9A52E] transition-opacity group-hover:opacity-85"
                    style={{ height: `${Math.max(8, secondaryPct)}%` }}
                    title={`${item.label} (${secondaryLabel}): ${item.secondaryValue}`}
                  />
                )}
              </div>
              <span className="text-[11px] font-medium text-[#64748B] tabular-nums">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface LineDatum {
  label: string;
  value: number;
}

export function AdminLineChart({
  data,
  seriesLabel = 'Enrolled Players (Demo)',
  strokeColor = '#071A36',
  accentColor = '#D9A52E',
}: {
  data: LineDatum[];
  seriesLabel?: string;
  strokeColor?: string;
  accentColor?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const width = 460;
  const height = 160;
  const padX = 28;
  const padY = 18;
  const maxVal = Math.max(1, ...data.map((d) => d.value));

  const points = data.map((item, index) => {
    const x =
      data.length <= 1
        ? width / 2
        : padX + (index / (data.length - 1)) * (width - padX * 2);
    const y =
      height - padY - (item.value / maxVal) * (height - padY * 2);
    return { x, y, ...item };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints =
    points.length > 0
      ? `${points[0].x},${height - padY} ${polylinePoints} ${points[points.length - 1].x},${height - padY}`
      : '';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-[#071A36]">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span>{seriesLabel}</span>
        </span>
        <span className="font-mono font-semibold text-[#071A36] tabular-nums">
          {activeIndex !== null && points[activeIndex]
            ? `${points[activeIndex].label}: ${points[activeIndex].value}`
            : `Latest: ${data[data.length - 1]?.value ?? 0}`}
        </span>
      </div>

      <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA]/70 p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-44 w-full overflow-visible"
          role="img"
          aria-label={`${seriesLabel} trend chart`}
        >
          {[0.25, 0.5, 0.75, 1].map((step) => {
            const yPos = height - padY - step * (height - padY * 2);
            return (
              <line
                key={step}
                x1={padX}
                x2={width - padX}
                y1={yPos}
                y2={yPos}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
            );
          })}

          {areaPoints && (
            <polygon points={areaPoints} fill={accentColor} fillOpacity="0.16" />
          )}

          {polylinePoints && (
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
          )}

          {points.map((pt, idx) => (
            <g
              key={pt.label}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activeIndex === idx ? 5.5 : 4}
                fill={accentColor}
                stroke={strokeColor}
                strokeWidth="2"
              />
              <text
                x={pt.x}
                y={height - 2}
                textAnchor="middle"
                className="fill-[#64748B] text-[10px] font-medium"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export function AdminDonutBreakdown({
  segments,
}: {
  segments: { label: string; count: number; color: string }[];
}) {
  const total = Math.max(
    1,
    segments.reduce((sum, seg) => sum + seg.count, 0),
  );

  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#F5F7FA] border border-[#E2E8F0]">
        {segments.map((seg) => {
          const pct = (seg.count / total) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={seg.label}
              style={{ width: `${pct}%`, backgroundColor: seg.color }}
              title={`${seg.label}: ${seg.count}`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {segments.map((seg) => {
          const pct = Math.round((seg.count / total) * 100);
          return (
            <div
              key={seg.label}
              className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA]/60 px-3 py-2 text-xs"
            >
              <span className="inline-flex items-center gap-2 font-medium text-[#071A36]">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span>{seg.label}</span>
              </span>
              <span className="font-mono font-bold text-[#071A36] tabular-nums">
                {seg.count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
