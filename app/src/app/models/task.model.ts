export interface Task {
  taskId: number;
  taskName: string;
  description: string;
  frequency: string;
  createdDate: Date;
  dueDate: string;
  isCompleted: boolean;
  userId: number;
}