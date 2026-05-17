import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { IconArrowLeft } from '@tabler/icons-react';
import { useAppState } from '~/hooks/use-app-state';
import { AuthenticatedPage } from '~/components/authenticated-page/authenticated-page';
import { StepProgressIndicator } from '~/blocks/create-goal/step-progress-indicator';
import { ThrustAreaSelectorGrid } from '~/blocks/create-goal/thrust-area-selector-grid';
import { GoalDetailForm } from '~/blocks/create-goal/goal-detail-form';
import { LiveWeightageBar } from '~/blocks/create-goal/live-weightage-bar';
import type { Goal } from '~/data/mock-data';
import styles from './create-goal.module.css';

export function meta() {
  return [{ title: 'Create New Goal — AtomQuest' }];
}

interface GoalFormSnapshot {
  weightage: number;
}

export default function CreateGoalPage() {
  return (
    <AuthenticatedPage allowedRoles={['employee']}>
      <CreateGoalInner />
    </AuthenticatedPage>
  );
}

function CreateGoalInner() {
  const { currentUser, goals, goalCycles, addGoal } = useAppState();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedThrustArea, setSelectedThrustArea] = useState<string | null>(null);
  const [formSnapshot, setFormSnapshot] = useState<GoalFormSnapshot>({ weightage: 10 });

  const activeCycle = goalCycles.find(c => c.isActive);
  const myGoals = goals.filter(g => g.employeeId === currentUser?.id);
  const existingWeightage = myGoals.reduce((s, g) => s + g.weightage, 0);

  function handleThrustSelect(id: string) {
    setSelectedThrustArea(id);
    setStep(2);
  }

  function handleFormSubmit(data: any) {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      employeeId: currentUser?.id || '',
      cycleId: activeCycle?.id || '',
      thrustAreaId: selectedThrustArea || '',
      title: data.title,
      description: data.description || '',
      uomType: data.uomType,
      targetValue: data.targetValue !== undefined ? Number(data.targetValue) : undefined,
      targetDate: data.targetDate,
      weightage: Number(data.weightage),
      status: 'draft',
      isShared: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addGoal(newGoal);
    navigate('/employee/dashboard');
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link to="/employee/dashboard" className={styles.backLink}>
          <IconArrowLeft size={14} /> Back to dashboard
        </Link>
        <div className={styles.header}>
          <h1 className={styles.title}>Create a New Goal</h1>
          <p className={styles.subtitle}>
            Define a measurable goal aligned with a strategic thrust area for FY 2025–26.
          </p>
        </div>

        <StepProgressIndicator currentStep={step} />

        <div className={styles.stepBody}>
          {step === 1 && (
            <ThrustAreaSelectorGrid selected={selectedThrustArea} onSelect={handleThrustSelect} />
          )}
          {step === 2 && (
            <GoalDetailForm
              existingWeightage={existingWeightage}
              onSubmit={handleFormSubmit}
              onBack={() => setStep(1)}
              onWeightageChange={(w) => setFormSnapshot(s => ({ ...s, weightage: w }))}
            />
          )}
        </div>
      </div>
      {step === 2 && (
        <LiveWeightageBar
          existingWeightage={existingWeightage}
          newWeightage={formSnapshot.weightage || 0}
        />
      )}
    </div>
  );
}
