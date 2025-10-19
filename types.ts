
export interface Menu {
  id: string;
  menuName: string;
  cookTime: number; // in seconds
}

export type TimerStatus = 'Ready' | 'Set' | 'InProgress' | 'Done';

export interface TimerState {
  timerId: number;
  status: TimerStatus;
  selectedMenuName: string;
  selectedCookTime: number; // original cook time
  remainingSeconds: number;
}
