export interface Milestone {
    milestoneId: number;
    milestoneName: string;
    description: string;
    targetDate: string;
    isCompleted: boolean;
    goalId: number;
  }
  
  export interface Goal {
    goalId: number;
    goalName: string;
    description: string;
    startDate: string;
    endDate: string;
    userId: number;
    isAchieved: boolean;
    milestones: Milestone[];
  }
  