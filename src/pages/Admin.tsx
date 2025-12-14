import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { dynamics } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Building2, 
  Users, 
  Globe, 
  Palette, 
  Upload,
  Sparkles,
  Edit3,
  Trash2,
  Plus,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function Admin() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [orgName, setOrgName] = useState('Adaptativa Demo Organization');
  const [enabledDynamics, setEnabledDynamics] = useState<Record<string, boolean>>(
    Object.fromEntries(dynamics.map(d => [d.id, true]))
  );

  const handleSave = () => {
    toast({
      title: language === 'es' ? 'Configuración guardada' : 'Settings saved',
      description: language === 'es' 
        ? 'Los cambios se han aplicado correctamente.' 
        : 'Your changes have been applied successfully.',
    });
  };

  const toggleDynamic = (id: string) => {
    setEnabledDynamics(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Mock users data
  const users = [
    { id: 1, name: 'María García', email: 'maria@adaptativa.com', role: 'Admin' },
    { id: 2, name: 'Carlos López', email: 'carlos@adaptativa.com', role: 'Leader' },
    { id: 3, name: 'Ana Martínez', email: 'ana@adaptativa.com', role: 'Leader' },
    { id: 4, name: 'Pedro Sánchez', email: 'pedro@adaptativa.com', role: 'Viewer' },
  ];

  const colorBgs: Record<string, string> = {
    'adaptativa-blue': 'bg-adaptativa-blue',
    'culture-yellow': 'bg-culture-yellow',
    'business-cyan': 'bg-business-cyan',
    'structure-neutral': 'bg-structure-neutral',
    'entrepreneurship-green': 'bg-entrepreneurship-green',
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-8 space-y-6 max-w-5xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          {t('admin.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'es' 
            ? 'Gestiona tu organización, usuarios y configuración' 
            : 'Manage your organization, users, and settings'}
        </p>
      </motion.div>

      {/* Organization */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              {t('admin.organization')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'es' ? 'Nombre de la Organización' : 'Organization Name'}</Label>
                <Input 
                  value={orgName} 
                  onChange={(e) => setOrgName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.logo')}</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-adaptativa-blue flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">A</span>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    {language === 'es' ? 'Cambiar Logo' : 'Change Logo'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users & Roles */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              {t('admin.users')}
            </CardTitle>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {language === 'es' ? 'Agregar Usuario' : 'Add User'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded",
                      user.role === 'Admin' && "bg-primary/10 text-primary",
                      user.role === 'Leader' && "bg-culture-yellow/10 text-culture-yellow",
                      user.role === 'Viewer' && "bg-muted text-muted-foreground"
                    )}>
                      {user.role}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language & Theme */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5" />
              {t('admin.theme')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('admin.language')}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es' ? 'Selecciona el idioma predeterminado' : 'Select default language'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={language === 'en' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
                <Button 
                  variant={language === 'es' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setLanguage('es')}
                >
                  Español
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{language === 'es' ? 'Modo Oscuro' : 'Dark Mode'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es' ? 'Activar tema oscuro estilo macOS' : 'Enable macOS-style dark theme'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enable/Disable Dynamics */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5" />
              {t('admin.dynamics')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dynamics.map((dynamic) => (
                <div 
                  key={dynamic.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", colorBgs[dynamic.color])} />
                    <span className="font-medium">
                      {language === 'es' ? dynamic.nameEs : dynamic.name}
                    </span>
                  </div>
                  <Switch 
                    checked={enabledDynamics[dynamic.id]} 
                    onCheckedChange={() => toggleDynamic(dynamic.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Demo Content */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Edit3 className="h-5 w-5" />
              {t('admin.content')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'es' 
                ? 'Todo el contenido de demostración es editable. Navega a cada sección para modificar el contenido.'
                : 'All demo content is editable. Navigate to each section to modify the content.'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Purpose', 'Dynamics', 'Objectives', 'Teams'].map((section) => (
                <Button key={section} variant="outline" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  {section}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants}>
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Check className="h-4 w-4" />
          {t('common.save')}
        </Button>
      </motion.div>
    </motion.div>
  );
}