export type UomType = 'numeric_min' | 'numeric_max' | 'timeline' | 'zero';

function daysDiff(dateA: Date, dateB: Date): number {
  return Math.floor((dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));
}

export function computeScore(
  uomType: UomType,
  target: number,
  actual: number,
  targetDate?: Date,
  completionDate?: Date
): number {
  switch (uomType) {
    case 'numeric_min':
      if (target === 0) return 0;
      return Math.min((actual / target) * 100, 150);
    case 'numeric_max':
      if (actual === 0) return 150;
      return Math.min((target / actual) * 100, 150);
    case 'timeline':
      if (!targetDate || !completionDate) return 0;
      if (completionDate <= targetDate) return 100;
      return Math.max(0, 100 - daysDiff(completionDate, targetDate) * 5);
    case 'zero':
      return actual === 0 ? 100 : 0;
    default:
      return 0;
  }
}

export function getUomLabel(uomType: UomType): string {
  const labels: Record<UomType, string> = {
    numeric_min: 'Numeric (Higher is Better)',
    numeric_max: 'Numeric (Lower is Better)',
    timeline: 'Date-Based',
    zero: 'Zero Incidents',
  };
  return labels[uomType];
}

export function getUomFormula(uomType: UomType): string {
  const formulas: Record<UomType, string> = {
    numeric_min: 'Score = min((Actual / Target) × 100, 150%) — Rewards over-achievement',
    numeric_max: 'Score = min((Target / Actual) × 100, 150%) — Lower actual is better (e.g. TAT, Cost)',
    timeline: 'Score = 100% if on time, else 100% − (days late × 5%) — Date milestone tracking',
    zero: 'Score = 100% if zero incidents, else 0% — Binary compliance goal',
  };
  return formulas[uomType];
}

export const GOAL_RULES = {
  MAX_GOALS: 8,
  MIN_WEIGHTAGE: 10,
  TOTAL_WEIGHTAGE: 100,
  MIN_GOALS_TO_SUBMIT: 1,
};
