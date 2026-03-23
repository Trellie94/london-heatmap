import SidebarHeader from './SidebarHeader';
import ActiveLayerPills from './ActiveLayerPills';
import CategoryList from './CategoryList';
import ThresholdPanel from './ThresholdPanel';

interface SidebarProps {
  coveragePct: number;
  menuButton?: React.ReactNode;
}

export default function Sidebar({ coveragePct, menuButton }: SidebarProps) {
  return (
    <aside
      className="h-full bg-sidebar flex flex-col border-r border-border"
      style={{ width: '340px', minWidth: '340px' }}
    >
      <SidebarHeader menuButton={menuButton} />
      <ActiveLayerPills />
      <CategoryList />
      <ThresholdPanel coveragePct={coveragePct} />
    </aside>
  );
}
