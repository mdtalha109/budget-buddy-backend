export interface RecurringMetadata {
    frequency?: string;
    interval?: number;
    endDate?: string;
    occurrences?: number;
    currentOccurrence?: number;
    nextOccurrence?: string;
    paused?: boolean;
  }