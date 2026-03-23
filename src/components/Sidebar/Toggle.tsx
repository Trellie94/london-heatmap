interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
}

export default function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className="relative shrink-0 cursor-pointer transition-all duration-200"
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: enabled ? 'rgba(212, 245, 60, 0.12)' : '#3A3A40',
        border: enabled ? '1px solid rgba(212, 245, 60, 0.3)' : '1px solid transparent',
      }}
    >
      <span
        className="absolute top-[2px] block rounded-full transition-all duration-200"
        style={{
          width: 14,
          height: 14,
          left: enabled ? 19 : 3,
          background: enabled ? '#D4F53C' : '#4A4A50',
          boxShadow: enabled ? '0 0 6px rgba(212, 245, 60, 0.25)' : 'none',
        }}
      />
    </button>
  );
}
