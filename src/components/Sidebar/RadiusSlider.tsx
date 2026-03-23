import Slider from './Slider';

interface RadiusSliderProps {
  value: number;
  color: string;
  onChange: (radius: number) => void;
}

export default function RadiusSlider({ value, color, onChange }: RadiusSliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="font-sans font-semibold uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.06em',
            color: '#4A4A50',
          }}
        >
          Walking Radius
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#F2F0EB',
            background: '#2E2E33',
            borderRadius: 6,
            padding: '2px 8px',
          }}
        >
          {value}m
        </span>
      </div>
      <Slider
        min={100}
        max={2000}
        step={50}
        value={value}
        color={color}
        onChange={onChange}
      />
    </div>
  );
}
