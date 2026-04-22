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
      description: language === 'es' ? 'Los cambios se han guardado correctamente.' : 'Your changes have been saved successfully.',
    });
  };

  const handleCancel = () => {
    setEditedPurpose(purpose);
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="page-container max-w-3xl">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <Target className="h-6 w-6 text-primary" />
            {t('purpose.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {language === 'es' ? 'Define el corazón de tu organización' : 'Define the heart of your organization'}
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-1.5">
            <Edit2 className="h-3.5 w-3.5" />
            {t('purpose.edit')}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" size="sm" className="gap-1.5">
              <X className="h-3.5 w-3.5" />
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} size="sm" className="gap-1.5">
              <Save className="h-3.5 w-3.5" />
              {t('purpose.save')}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Problem Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-border/60 overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-status-warning to-culture-yellow" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2.5 text-base">
              <div className="p-1.5 bg-status-warning-bg rounded-lg">
                <Lightbulb className="h-4 w-4 text-status-warning" />
              </div>
              {t('purpose.problem')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">English</label>
                  <Textarea value={editedPurpose.problem} onChange={(e) => setEditedPurpose({ ...editedPurpose, problem: e.target.value })} className="min-h-[100px] text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Español</label>
                  <Textarea value={editedPurpose.problemEs} onChange={(e) => setEditedPurpose({ ...editedPurpose, problemEs: e.target.value })} className="min-h-[100px] text-sm" />
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed">
                {language === 'es' ? purpose.problemEs : purpose.problem}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Impact Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-border/60 overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-primary to-entrepreneurship-green" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2.5 text-base">
              <div className="p-1.5 bg-status-success-bg rounded-lg">
                <Heart className="h-4 w-4 text-status-success" />
              </div>
              {t('purpose.impact')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">English</label>
                  <Textarea value={editedPurpose.impact} onChange={(e) => setEditedPurpose({ ...editedPurpose, impact: e.target.value })} className="min-h-[100px] text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Español</label>
                  <Textarea value={editedPurpose.impactEs} onChange={(e) => setEditedPurpose({ ...editedPurpose, impactEs: e.target.value })} className="min-h-[100px] text-sm" />
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed">
                {language === 'es' ? purpose.impactEs : purpose.impact}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tip */}
      <motion.div variants={itemVariants}>
        <div className="bg-muted/60 rounded-lg px-4 py-3 border border-border/60">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">💡 Tip:</strong> {language === 'es' 
              ? 'Tu propósito debe ser visible en todas las decisiones. Úsalo como brújula para alinear objetivos y dinámicas.'
              : 'Your purpose should be visible in every decision. Use it as a compass to align objectives and dynamics.'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
