import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { TaskService } from '../../services/task.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatExpansionModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef;

  newTask: Task = {
    taskId: 0,
    taskName: '',
    description: '',
    frequency: 'daily',
    createdDate: new Date(),
    dueDate: '',
    isCompleted: false,
    userId: 0,
  };

  today: string = new Date().toISOString().split('T')[0];
  dailyTasks: Task[] = [];
  weeklyTasks: Task[] = [];
  monthlyTasks: Task[] = [];

  dailyTasksCompleted: Task[] = [];
  dailyTasksUncompleted: Task[] = [];
  weeklyTasksCompleted: Task[] = [];
  weeklyTasksUncompleted: Task[] = [];
  monthlyTasksCompleted: Task[] = [];
  monthlyTasksUncompleted: Task[] = [];
  
  isLoading = false;

  goalService = inject(GoalService);
  taskService = inject(TaskService);
  authService = inject(AuthService);

  ngOnInit() {
    console.log('date', this.today);

    // Initialize user ID when component loads
    this.authService.currentUser$.subscribe((user) => {
      if (user && user.id) {
        this.newTask.userId = user.id;
        this.loadAllTasks();
      }
    });
  }

  loadAllTasks() {
    this.isLoading = true;
    this.authService.currentUser$.subscribe((user) => {
      if (user && user.id) {
        const userId = user.id;
        this.taskService.getAllTasksByUserId(userId).subscribe({
          next: (tasks) => {
            console.log('test');

            console.log(tasks);

            // Sort tasks by frequency
            this.dailyTasks = tasks.filter(
              (task) => task.frequency === 'daily'
            );
            this.weeklyTasks = tasks.filter(
              (task) => task.frequency === 'weekly'
            );
            this.monthlyTasks = tasks.filter(
              (task) => task.frequency === 'monthly'
            );
            this.loadCompleted();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading tasks:', error);
            this.isLoading = false;
          },
        });
      }
    });
  }

  loadCompleted(){
    this.dailyTasksCompleted = this.dailyTasks.filter((task) => task.isCompleted);
    this.dailyTasksUncompleted = this.dailyTasks.filter((task) => !task.isCompleted);

    this.weeklyTasksCompleted = this.weeklyTasks.filter((task) => task.isCompleted);
    this.weeklyTasksUncompleted = this.weeklyTasks.filter((task) => !task.isCompleted);

    this.monthlyTasksCompleted = this.monthlyTasks.filter((task) => task.isCompleted);
    this.monthlyTasksUncompleted = this.monthlyTasks.filter((task) => !task.isCompleted);
  }


  openModal() {
    if (this.modal) {
      this.modal.nativeElement.style.display = 'block';
      this.modal.nativeElement.classList.add('show');
      document.body.classList.add('modal-open');

      // Create a backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.nativeElement.style.display = 'none';
      this.modal.nativeElement.classList.remove('show');
      document.body.classList.remove('modal-open');
        this.loadAllTasks();

      // Remove backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  createTask() {
    this.authService.currentUser$.subscribe((user) => {
      if (user && user.id) {
        this.newTask.userId = user.id;
      }
    });
    console.log('task.userId', this.newTask.userId);

    this.taskService.createTask(this.newTask).subscribe({
      next: (response) => {
        console.log('Task created:', response);

        // Reload all tasks to refresh the lists
        this.loadAllTasks();

        // Reset form and close modal
        this.resetForm();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating task:', error);
      },
    });
  }

  resetForm() {
    this.newTask = {
      taskId: 0,
      taskName: '',
      description: '',
      frequency: 'daily',
      createdDate: new Date(),
      dueDate: '',
      isCompleted: false,
      userId: this.goalService.user?.userId || 0,
    };
  }

  toggleTaskCompletion(task: Task) {
    this.taskService.updateTaskStatus(task.taskId, task.isCompleted).subscribe({
      next: (response) => {
        console.log('Task status updated:', response);
                this.loadAllTasks();

      },
      error: (error) => {
        console.error('Error updating task status:', error);
        // Revert the UI change if the API call fails
        task.isCompleted = !task.isCompleted;
      },
    });
  }

  deleteTask(task: Task, category: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.taskId).subscribe({
        next: () => {
                  this.loadAllTasks();

        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
