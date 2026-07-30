"use client";

type ProgressGaugeProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export default function ProgressGauge({
  percentage,
  size = 160,
  strokeWidth = 12,
  label = "Progression",
}: ProgressGaugeProps) {
  // ─── Clamp entre 0 et 100 ───
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} : ${clamped}%`}
      >
        {/* ─── Cercle de fond ─── */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />

        {/* ─── Cercle de progression ─── */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-700 ease-out"
        />
      </svg>

      {/* ─── Texte centré (superposé par position absolue) ─── */}
      <div
        className="absolute flex flex-col items-center justify-center pointer-events-none"
        style={{ width: size, height: size }}
      >
        <span className="text-3xl font-bold text-foreground tracking-tight">
          {clamped}%
        </span>
        <span className="text-xs font-medium text-muted-foreground mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}

export function ProgressBar({
  percentage,
  label = "Progression",
  showLabel = true,
}: {
  percentage: number;
  label?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} : ${clamped}%`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-sm font-bold text-primary">{clamped}%</span>
        </div>
      )}
      <div className="w-full h-3 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}