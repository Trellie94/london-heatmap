import Slider from './Slider';

interface WeightControlProps {
  value: number;
  color: string;
  onChange: (weight: number) => void;
}

export default function WeightControl({ value, color, onChange }: WeightControlProps) {
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
          Significance
        </span>
        {/* Dot indicators */}
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                background: i < value ? '#D4F53C' : '#3A3A40',
                transition: 'background 0.15s ease',
              }}
            />
          ))}
        </div>
      </div>
      <Slider
        min={1}
        max={10}
        step={1}
        value={value}
        color={color}
        onChange={onChange}
      />
    </div>
  );
}
