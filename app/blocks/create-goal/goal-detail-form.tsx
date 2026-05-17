import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getUomFormula } from '~/data/score-engine';
import type { UomType } from '~/data/score-engine';
import styles from './goal-detail-form.module.css';

interface FormData {
  title: string;
  description: string;
  uomType: UomType;
  targetValue?: number;
  targetDate?: string;
  weightage: number;
}

interface Props {
  existingWeightage: number;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  onWeightageChange?: (weightage: number) => void;
}

export function GoalDetailForm({ existingWeightage, onSubmit, onBack, onWeightageChange }: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { uomType: 'numeric_min', weightage: 10 },
  });
  const uomType = watch('uomType');
  const weightage = watch('weightage');
  const remaining = Math.max(0, 100 - existingWeightage);

  useEffect(() => {
    onWeightageChange?.(Number(weightage) || 0);
  }, [weightage, onWeightageChange]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label className={styles.label}>Goal Title <span className={styles.required}>*</span></label>
        <input
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          placeholder="e.g. Achieve ₹50L in new business revenue"
          {...register('title', { required: 'Goal title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
        />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          placeholder="Describe how you plan to achieve this goal..."
          rows={3}
          {...register('description')}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Measurement Type (UoM) <span className={styles.required}>*</span></label>
        <div className={styles.uomGrid}>
          {(['numeric_min', 'numeric_max', 'timeline', 'zero'] as UomType[]).map(type => (
            <label key={type} className={`${styles.uomOption} ${uomType === type ? styles.uomSelected : ''}`}>
              <input type="radio" value={type} {...register('uomType')} className={styles.radioHidden} />
              <div className={styles.uomLabel}>
                {type === 'numeric_min' && '↑ Higher is Better'}
                {type === 'numeric_max' && '↓ Lower is Better'}
                {type === 'timeline' && '📅 Date Milestone'}
                {type === 'zero' && '🛡 Zero Incidents'}
              </div>
            </label>
          ))}
        </div>
        {uomType && (
          <div className={styles.formulaPreview}>
            <span className={styles.formulaLabel}>Formula:</span> {getUomFormula(uomType)}
          </div>
        )}
      </div>

      {(uomType === 'numeric_min' || uomType === 'numeric_max' || uomType === 'zero') && (
        <div className={styles.field}>
          <label className={styles.label}>
            Target Value <span className={styles.required}>*</span>
            {uomType === 'zero' && <span className={styles.hint}> (typically 0)</span>}
          </label>
          <input
            type="number"
            step="any"
            className={`${styles.input} ${errors.targetValue ? styles.inputError : ''}`}
            placeholder="Enter numerical target"
            {...register('targetValue', {
              required: 'Target value is required',
              min: { value: 0, message: 'Must be non-negative' },
              valueAsNumber: true,
            })}
          />
          {errors.targetValue && <span className={styles.error}>{errors.targetValue.message}</span>}
        </div>
      )}

      {uomType === 'timeline' && (
        <div className={styles.field}>
          <label className={styles.label}>Target Date <span className={styles.required}>*</span></label>
          <input
            type="date"
            className={`${styles.input} ${errors.targetDate ? styles.inputError : ''}`}
            {...register('targetDate', { required: 'Target date is required' })}
          />
          {errors.targetDate && <span className={styles.error}>{errors.targetDate.message}</span>}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>
          Weightage (%) <span className={styles.required}>*</span>
          <span className={styles.hint}> — Remaining: {remaining}%</span>
        </label>
        <input
          type="number"
          min={10}
          max={remaining || 100}
          className={`${styles.input} ${errors.weightage ? styles.inputError : ''}`}
          {...register('weightage', {
            required: 'Weightage is required',
            min: { value: 10, message: 'Minimum 10% weightage per goal' },
            max: { value: remaining || 100, message: `Cannot exceed ${remaining}% remaining` },
            valueAsNumber: true,
          })}
        />
        {errors.weightage && <span className={styles.error}>{errors.weightage.message}</span>}
      </div>

      <div className={styles.btnRow}>
        <button type="button" className={styles.btnBack} onClick={onBack}>← Back</button>
        <button type="submit" className={styles.btnSubmit}>Create Goal</button>
      </div>
    </form>
  );
}
