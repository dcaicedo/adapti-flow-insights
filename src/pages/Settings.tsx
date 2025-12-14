import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Monitor,
  Bell,
  Lock,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

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

  const settingsSections = [
    {
      title: t('settings.appearance'),
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: t('settings.darkMode'),
          description: language === 'es' 
            ? 'Activar tema oscuro para reducir fatiga visual' 
            : 'Enable dark theme to reduce eye strain',
          control: (
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          ),
        },
      ],
    },
    {
      title: t('settings.language'),
      items: [
        {
          icon: Globe,
          label: language === 'es' ? 'Idioma de la Interfaz' : 'Interface Language',
          description: language === 'es' 
            ? 'Selecciona el idioma de la plataforma' 
            : 'Select the platform language',
          control: (
            <div className="flex gap-2">
              <Button 
                variant={language === 'en' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setLanguage('en')}
                className="min-w-[80px]"
              >
                English
              </Button>
              <Button 
                variant={language === 'es' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setLanguage('es')}
                className="min-w-[80px]"
              >
                Español
              </Button>
            </div>
          ),
        },
      ],
    },
    {
      title: language === 'es' ? 'Notificaciones' : 'Notifications',
      items: [
        {
          icon: Bell,
          label: language === 'es' ? 'Alertas por Email' : 'Email Alerts',
          description: language === 'es' 
            ? 'Recibe alertas críticas por correo electrónico' 
            : 'Receive critical alerts via email',
          control: <Switch defaultChecked />,
        },
        {
          icon: Monitor,
          label: language === 'es' ? 'Notificaciones del Navegador' : 'Browser Notifications',
          description: language === 'es' 
            ? 'Mostrar notificaciones en el navegador' 
            : 'Show browser notifications',
          control: <Switch />,
        },
      ],
    },
    {
      title: language === 'es' ? 'Seguridad' : 'Security',
      items: [
        {
          icon: Lock,
          label: language === 'es' ? 'Autenticación en Dos Pasos' : 'Two-Factor Authentication',
          description: language === 'es' 
            ? 'Añade una capa extra de seguridad' 
            : 'Add an extra layer of security',
          control: (
            <Button variant="outline" size="sm">
              {language === 'es' ? 'Configurar' : 'Configure'}
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-8 space-y-6 max-w-3xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-muted-foreground" />
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'es' 
            ? 'Personaliza tu experiencia en la plataforma' 
            : 'Customize your platform experience'}
        </p>
      </motion.div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <motion.div key={sectionIndex} variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className={cn(
                    "flex items-center justify-between py-4",
                    itemIndex !== section.items.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {item.control}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Help Section */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm bg-gradient-to-r from-muted/50 to-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {language === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'es' 
                    ? 'Accede a nuestra documentación y soporte' 
                    : 'Access our documentation and support'}
                </p>
              </div>
              <Button variant="outline">
                {language === 'es' ? 'Ver Documentación' : 'View Documentation'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}