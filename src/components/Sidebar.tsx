import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Trophy, 
  Globe, 
  Package, 
  Users, 
  Map, 
  Share2,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface SidebarProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'overview', label: '项目总览', icon: LayoutDashboard },
  { id: 'top20', label: 'TOP20国家', icon: Trophy },
  { id: 'countries', label: '国家画像', icon: Globe },
  { id: 'products', label: '品线分析', icon: Package },
  { id: 'segments', label: '客群矩阵', icon: Users },
  { id: 'clusters', label: '区域策略', icon: Map },
  { id: 'platforms', label: '平台入口', icon: Share2 },
  { id: 'infoSources', label: '信息源质量分层', icon: ShieldCheck },
  { id: 'p1Search', label: 'P1搜索清单', icon: Search },
];

export function Sidebar({ activeSection, onSectionClick, isOpen, onToggle }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-sm">VOC分析</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">V</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', !isOpen && 'hidden')}
          onClick={onToggle}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Toggle Button when collapsed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-16 h-6 w-6 rounded-full bg-primary text-primary-foreground shadow-md"
          onClick={onToggle}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  !isOpen && 'justify-center px-2'
                )}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-border">
        <Button
          variant="ghost"
          size={isOpen ? 'default' : 'icon'}
          className={cn('w-full', !isOpen && 'justify-center')}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4" />
              {isOpen && <span className="ml-2">浅色模式</span>}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              {isOpen && <span className="ml-2">深色模式</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
