import { useState, type ReactNode } from 'react';
import Toggle from './Toggle';

interface CategoryGroupHeaderProps {
  groupName: string;
  anyEnabled: boolean;
  onToggleAll: () => void;
  children: ReactNode;
}

export default function CategoryGroupHeader({
  groupName,
  anyEnabled,
  onToggleAll,
  children,
}: CategoryGroupHeaderProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ marginBottom: 6 }}>
      {/* Group header */}
      <div
        className="flex items-center gap-3 cursor-pointer transition-all duration-150"
        style={{
          background: '#1E1E21',
          border: '1px solid #2E2E33',
          borderRadius: expanded ? '14px 14px 0 0' : 14,
          padding: '10px 14px',
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {/* Chevron */}
        <span
          className="shrink-0 transition-transform duration-150"
          style={{
            display: 'inline-flex',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            color: '#4A4A50',
            fontSize: '10px',
          }}
        >
          ▶
        </span>

        {/* Group name */}
        <span
          className="flex-1 font-sans uppercase"
          style={{
            fontWeight: 700,
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: '#6E6E75',
          }}
        >
          {groupName}
        </span>

        {/* Master toggle */}
        <div onClick={(e) => e.stopPropagation()}>
          <Toggle enabled={anyEnabled} onChange={onToggleAll} />
        </div>
      </div>

      {/* Children (sub-categories) */}
      {expanded && (
        <div
          style={{
            borderLeft: '1px solid #2E2E33',
            borderRight: '1px solid #2E2E33',
            borderBottom: '1px solid #2E2E33',
            borderRadius: '0 0 14px 14px',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
