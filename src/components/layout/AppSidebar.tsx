import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Sparkles, 
  Trophy, 
  Users, 
  Network, 
  BarChart3, 
  Settings, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Languages
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/purpose', icon: Target, labelKey: 'nav.purpose' },
  { path: '/dynamics', icon: Sparkles, labelKey: 'nav.dynamics' },
  { path: '/objectives', icon: Trophy, labelKey: 'nav.objectives' },
  { path: '/teams', icon: Users, labelKey: 'nav.teams' },
  { path: '/structure', icon: Network, labelKey: 'nav.structure' },
  { path: '/reports', icon: BarChart3, labelKey: 'nav.reports' },
  { path: '/admin', icon: Shield, labelKey: 'nav.admin' },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
];

export function AppSidebar() {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-adaptativa-blue flex items-center justify-center">
              <span className="text-sm font-bold text-sidebar-primary-foreground">A</span>
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">Adaptativa</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-adaptativa-blue flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-sidebar-primary-foreground">A</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "text-sidebar-foreground hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent text-sidebar-primary font-medium"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm"
                    >
                      {t(item.labelKey)}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={toggleTheme}
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent justify-start",
            collapsed && "justify-center"
          )}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          {!collapsed && <span className="ml-3 text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </Button>

        {/* Language Toggle */}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent justify-start",
            collapsed && "justify-center"
          )}
        >
          <Languages className="h-4 w-4" />
          {!collapsed && <span className="ml-3 text-sm">{language === 'en' ? 'Español' : 'English'}</span>}
        </Button>

        {/* Expand Button */}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(false)}
            className="w-full text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.aside>
  );
}