interface RoostLogoProps {
  size?: number;
  className?: string;
}

export default function RoostLogo({ size = 40, className = '' }: RoostLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chimney */}
        <rect x="70" y="130" width="60" height="50" rx="3" stroke="currentColor" strokeWidth="3" />
        <rect x="64" y="125" width="72" height="10" rx="2" stroke="currentColor" strokeWidth="3" />
        {/* Rooftop lines */}
        <line x1="20" y1="180" x2="70" y2="155" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
        <line x1="130" y1="155" x2="180" y2="180" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
        {/* Body */}
        <ellipse cx="100" cy="108" rx="28" ry="22" stroke="currentColor" strokeWidth="3" />
        {/* Neck */}
        <path d="M 112 94 Q 118 78 114 65" stroke="currentColor" strokeWidth="3" />
        {/* Head */}
        <circle cx="114" cy="58" r="12" stroke="currentColor" strokeWidth="3" />
        {/* Eye */}
        <circle cx="118" cy="56" r="2.5" fill="currentColor" />
        {/* Beak */}
        <path d="M 126 57 L 136 54 L 126 60" stroke="currentColor" strokeWidth="2.5" />
        {/* Comb */}
        <path d="M 106 50 Q 108 38 112 42 Q 114 34 118 40 Q 120 32 122 40 Q 118 48 116 47" stroke="currentColor" strokeWidth="2.5" />
        {/* Wattle */}
        <path d="M 120 63 Q 124 70 118 68" stroke="currentColor" strokeWidth="2" />
        {/* Tail feathers */}
        <path d="M 72 98 Q 52 78 48 60" stroke="currentColor" strokeWidth="3" />
        <path d="M 72 102 Q 48 86 40 72" stroke="currentColor" strokeWidth="2.5" />
        <path d="M 72 106 Q 44 96 36 84" stroke="currentColor" strokeWidth="2" />
        {/* Feet */}
        <path d="M 90 125 L 88 130 M 85 128 L 91 128" stroke="currentColor" strokeWidth="2" />
        <path d="M 110 125 L 112 130 M 109 128 L 115 128" stroke="currentColor" strokeWidth="2" />
        {/* Wing */}
        <path d="M 88 100 Q 100 95 108 104" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      </svg>
      <span className="font-bold text-lg tracking-tight">Roost</span>
    </div>
  );
}
