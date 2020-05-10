export interface BusinessTripWSInfo {
  state: string;
  errors?: string[];
  progress?: number;
  timeLeft?: number;
  noRoute?: boolean;
  error?: boolean;
}
