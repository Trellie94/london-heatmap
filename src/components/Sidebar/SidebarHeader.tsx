interface SidebarHeaderProps {
  menuButton?: React.ReactNode;
}

export default function SidebarHeader({ menuButton }: SidebarHeaderProps) {
  return (
    <div className="px-5 pt-5 pb-4 border-b border-border">
      <div className="flex items-center gap-2.5">
        {menuButton}
        <div
          className="w-2 h-2 rounded-full bg-accent"
          style={{ boxShadow: '0 0 8px rgba(212, 245, 60, 0.4)' }}
        />
        <h1
          className="font-sans font-bold text-text-primary"
          style={{ fontSize: '15px', letterSpacing: '-0.02em' }}
        >
          Wandsworth Heatmap
        </h1>
      </div>
    </div>
  );
}
