/*
  Semicircular gauge, deliberately styled after a handheld instrument
  readout (soil meter, multimeter) rather than a generic progress ring —
  this app IS a diagnostic instrument, so it should look like one.
  The arc colour is passed in by the caller and matches the real lesion
  colour of the predicted disease (see diseaseMeta.js).
*/
const RADIUS = 80;
const CENTER = 100;
const ARC_LENGTH = Math.PI * RADIUS; // half circumference

export default function ConfidenceGauge({ percentage, color, label }) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = ARC_LENGTH - (ARC_LENGTH * clamped) / 100;

  return (
    <div className="gauge" role="img" aria-label={`${label}: ${clamped.toFixed(0)}%`}>
      <svg viewBox="0 0 200 110" width="220" height="121" aria-hidden="true">
        <path
          d="M20,100 A80,80 0 0 1 180,100"
          fill="none"
          stroke="var(--color-surface-sunken)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M20,100 A80,80 0 0 1 180,100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="gauge__value" style={{ color }}>
        {clamped.toFixed(0)}%
      </div>
      <div className="gauge__label">{label}</div>
    </div>
  );
}
