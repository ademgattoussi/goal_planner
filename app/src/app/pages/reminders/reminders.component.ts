import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reminders',
  imports: [CommonModule],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.scss',
})
export class RemindersComponent implements OnInit {
  taskService = inject(TaskService);
  tasks : Task[] = [];
  authService = inject(AuthService);
  ngOnInit(): void {
      this.getUpcomingDeadlines();
  }

  getUpcomingDeadlines(){
    const userId = this.authService.currentUser?.id;
    if(userId){
    this.taskService.getAllTasksByUserId(userId).pipe(
      map(tasks => tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);
        return dueDate >= today && dueDate <= threeDaysFromNow;
      }))
    ).subscribe(filteredTasks => {
      this.tasks = filteredTasks;
    });
    }
  }

  getPriorityClass(task: Task): string {
  const name = task.taskName.toLowerCase();
  if (name.includes('report')) return 'high';
  if (name.includes('exam')) return 'medium';
  return 'low';
}

getPriorityLabel(task: Task): string {
  const name = task.taskName.toLowerCase();
  if (name.includes('report')) return 'High';
  if (name.includes('exam')) return 'Medium';
  return 'Low';
}

getDueDateLabel(dueDate: string): string {
  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "'Today'";
  }

  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    return "'Tomorrow'";
  }

  return 'MMM d, y'; // fallback format
}

}
