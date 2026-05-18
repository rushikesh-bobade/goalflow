export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'employee' | 'manager' | 'admin'
          department: string | null
          manager_id: string | null
          avatar_initials: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'employee' | 'manager' | 'admin'
          department?: string | null
          manager_id?: string | null
          avatar_initials?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'employee' | 'manager' | 'admin'
          department?: string | null
          manager_id?: string | null
          avatar_initials?: string | null
          created_at?: string
        }
      }
      thrust_areas: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
      }
      goal_cycles: {
        Row: {
          id: string
          name: string
          phase: 'goal_setting' | 'q1' | 'q2' | 'q3' | 'q4'
          window_open: string
          window_close: string
          is_active: boolean
          created_at: string
        }
      }
      goals: {
        Row: {
          id: string
          employee_id: string
          cycle_id: string
          thrust_area_id: string
          title: string
          description: string | null
          uom_type: 'numeric_min' | 'numeric_max' | 'timeline' | 'zero'
          target_value: number | null
          target_date: string | null
          weightage: number
          status: 'draft' | 'submitted' | 'approved' | 'rework' | 'locked'
          is_shared: boolean
          shared_by: string | null
          parent_goal_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          cycle_id: string
          thrust_area_id: string
          title: string
          description?: string | null
          uom_type: 'numeric_min' | 'numeric_max' | 'timeline' | 'zero'
          target_value?: number | null
          target_date?: string | null
          weightage: number
          status?: 'draft' | 'submitted' | 'approved' | 'rework' | 'locked'
          is_shared?: boolean
          shared_by?: string | null
          parent_goal_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          cycle_id?: string
          thrust_area_id?: string
          title?: string
          description?: string | null
          uom_type?: 'numeric_min' | 'numeric_max' | 'timeline' | 'zero'
          target_value?: number | null
          target_date?: string | null
          weightage?: number
          status?: 'draft' | 'submitted' | 'approved' | 'rework' | 'locked'
          is_shared?: boolean
          shared_by?: string | null
          parent_goal_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          goal_id: string
          cycle_id: string
          quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
          actual_value: number | null
          actual_date: string | null
          progress_status: 'not_started' | 'on_track' | 'completed'
          computed_score: number | null
          manager_comment: string | null
          employee_submitted_at: string | null
          manager_reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          cycle_id: string
          quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
          actual_value?: number | null
          actual_date?: string | null
          progress_status?: 'not_started' | 'on_track' | 'completed'
          computed_score?: number | null
          manager_comment?: string | null
          employee_submitted_at?: string | null
          manager_reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          cycle_id?: string
          quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4'
          actual_value?: number | null
          actual_date?: string | null
          progress_status?: 'not_started' | 'on_track' | 'completed'
          computed_score?: number | null
          manager_comment?: string | null
          employee_submitted_at?: string | null
          manager_reviewed_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          deep_link: string | null
          created_at: string
        }
      }
    }
  }
}
