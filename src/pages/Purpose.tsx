import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { purpose as initialPurpose, Purpose as PurposeType } from '@/data/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, Edit2, Save, X, Lightbulb, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Purpose() {
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [purpose, setPurpose] = useState<PurposeType>(initialPurpose);
  const [editedPurpose, setEditedPurpose] = useState<PurposeType>(purpose);

  const handleSave = () => {
    setPurpose(editedPurpose);
    setIsEditing(false);
    toast({
      title: language === 'es' ? 'Propósito actualizado' : 'Purpose updated',
      description: language === 'es' 
        ? 'Los cambios se han guardado correctamente.' 
        : 'Your changes have been saved successfully.',
    });
  };

  const handleCancel = () => {
    setEditedPurpose(purpose);
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-8 space-y-6 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="h-8 w-8 text-adaptativa-blue" />
            {t('purpose.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'es' 
              ? 'Define el corazón de tu organización' 
              : 'Define the heart of your organization'}
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            {t('purpose.edit')}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              {t('purpose.save')}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Problem Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-status-warning to-culture-yellow" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-status-warning-bg rounded-lg">
                <Lightbulb className="h-5 w-5 text-status-warning" />
              </div>
              {t('purpose.problem')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">English</label>
                  <Textarea
                    value={editedPurpose.problem}
                    onChange={(e) => setEditedPurpose({ ...editedPurpose, problem: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Español</label>
                  <Textarea
                    value={editedPurpose.problemEs}
                    onChange={(e) => setEditedPurpose({ ...editedPurpose, problemEs: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed text-lg">
                {language === 'es' ? purpose.problemEs : purpose.problem}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Impact Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-adaptativa-blue to-entrepreneurship-green" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-status-success-bg rounded-lg">
                <Heart className="h-5 w-5 text-status-success" />
              </div>
              {t('purpose.impact')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">English</label>
                  <Textarea
                    value={editedPurpose.impact}
                    onChange={(e) => setEditedPurpose({ ...editedPurpose, impact: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Español</label>
                  <Textarea
                    value={editedPurpose.impactEs}
                    onChange={(e) => setEditedPurpose({ ...editedPurpose, impactEs: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed text-lg">
                {language === 'es' ? purpose.impactEs : purpose.impact}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tip */}
      <motion.div variants={itemVariants}>
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> {language === 'es' 
              ? 'Tu propósito debe ser visible en todas las decisiones. Úsalo como brújula para alinear objetivos y dinámicas.'
              : 'Your purpose should be visible in every decision. Use it as a compass to align objectives and dynamics.'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}