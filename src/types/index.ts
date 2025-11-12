export interface Quality {
  id: string;
  title: string;
  description: string;
}

export interface Memory {
  id: string;
  title: string;
  date?: string;
  description: string;
  position: { x: number; y: number };
}

export interface Layer {
  id: number;
  name: string;
  completed: boolean;
}

export interface SilencePoem {
  id: string;
  content: string;
  layer?: number;
}

export interface Letter {
  letter_key: string;
  title: string;
  content: string;
  unlock_type: 'absolute' | 'relative';
  unlock_date: string;
  position_order: number;
  is_unlocked?: boolean;
  is_opened?: boolean;
  is_bookmarked?: boolean;
}

export interface UserVisit {
  user_identifier: string;
  first_visit_at: string;
}

export interface UserLetterState {
  user_identifier: string;
  letter_key: string;
  is_opened: boolean;
  is_bookmarked: boolean;
  opened_at?: string;
}
