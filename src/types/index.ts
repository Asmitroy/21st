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
