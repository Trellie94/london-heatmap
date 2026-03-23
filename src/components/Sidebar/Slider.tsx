import { useCallback, useRef, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  color: string; // track fill colour
  onChange: (value: number) => void;
}

export default function Slider({ min, max, step, value, color, onChange }: SliderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pct = ((value - min) / (max - min)) * 100;

  const updateTrackFill = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.style.background = `linear-gradient(to right, ${color} ${pct}%, #3A3A40 ${pct}%)`;
  }, [color, pct]);

  useEffect(() => {
    updateTrackFill();
  }, [updateTrackFill]);

  return (
    <input
      ref={inputRef}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  );
}
