import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Target, Sparkles, Trophy, Users, 
  Network, BarChart3, Settings, Shield, PanelLeftClose, 
  PanelLeft, Moon, Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { organizationInfo } from '@/data/demoData';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/purpose', icon: Target, labelKey: 'nav.purpose' },
  { path: '/dynamics', icon: Sparkles, labelKey: 'nav.dynamics' },
  { path: '/objectives', icon: Trophy, labelKey: 'nav.objectives' },
  { path: '/teams', icon: Users, labelKey: 'nav.teams' },
  { path: '/structure', icon: Network, labelKey: 'nav.structure' },
  { path: '/reports', icon: BarChart3, labelKey: 'nav.reports' },
];

const bottomItems = [
  { path: '/admin', icon: Shield, labelKey: 'nav.admin' },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
];

export function AppSidebar() {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const renderNavItem = (item: typeof navItems[0]) => {
    const isActive = location.pathname === item.path;
    const link = (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group relative",
          "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className={cn(
          "h-[18px] w-[18px] flex-shrink-0 transition-colors",
          isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
        )} />
        {!collapsed && (
          <span className="text-[13px] truncate">{t(item.labelKey)}</span>
        )}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-sidebar-primary" />
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path} delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {t(item.labelKey)}
          </TooltipContent>
        </Tooltip>
      );
    }
    return <li key={item.path}>{link}</li>;
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-[width] duration-200 ease-in-out flex-shrink-0",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-14 flex items-center border-b border-sidebar-border",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-adaptativa-blue flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-sidebar-foreground">
                {organizationInfo.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-sidebar-foreground/40">
                {organizationInfo.name.split(' ')[1]}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-adaptativa-blue flex items-center justify-center">
            <span className="text-sm font-bold text-white">A</span>
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(true)}
            className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent h-7 w-7"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map(renderNavItem)}
        </ul>
        
        <div className="my-3 mx-3 border-t border-sidebar-border" />
        
        <ul className="space-y-0.5 px-2">
          {bottomItems.map(renderNavItem)}
        </ul>
      </nav>

      {/* Footer Controls */}
      <div className={cn(
        "border-t border-sidebar-border py-2",
        collapsed ? "px-1.5" : "px-2"
      )}>
        <div className={cn("flex", collapsed ? "flex-col gap-1" : "gap-1")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8 text-[11px] font-bold"
          >
            {language === 'en' ? 'ES' : 'EN'}
          </Button>

          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(false)}
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
