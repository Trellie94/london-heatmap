import { useState, useRef, useEffect } from 'react';

interface MenuButtonProps {
  onMethodology: () => void;
  /** When true, renders inline (for embedding in sidebar header). Otherwise fixed-position overlay. */
  inline?: boolean;
}

export default function MenuButton({ onMethodology, inline }: MenuButtonProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div
      ref={menuRef}
      className={inline ? 'relative' : 'fixed top-4 left-4'}
      style={{ zIndex: 1000 }}
    >
      {/* Hamburger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center transition-colors"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: '#1E1E21',
          border: '1px solid #2E2E33',
        }}
        aria-label="Menu"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: '#6E6E75' }}
        >
          <rect y="2" width="16" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="7.25" width="16" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="12.5" width="16" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="mt-1"
          style={{
            background: '#1E1E21',
            border: '1px solid #2E2E33',
            borderRadius: 10,
            padding: '4px',
            minWidth: 160,
          }}
        >
          <button
            onClick={() => {
              setOpen(false);
              onMethodology();
            }}
            className="w-full text-left font-sans transition-colors"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#F2F0EB',
              padding: '8px 12px',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = '#252528';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = 'transparent';
            }}
          >
            Methodology
          </button>
        </div>
      )}
    </div>
  );
}
