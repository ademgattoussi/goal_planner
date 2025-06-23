import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { endpoints } from '../../environments/endpoints';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';



@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  get user() {
    const user$ = this.auth.currentUser$;
    return user$ ? user$ : null;
  }

  createTask(task: Task): Observable<any> {
    return this.api.post(endpoints.task.base, task);
  }

  getAllTasksByUserId(userId: number): Observable<Task[]> {
  const params = new HttpParams().set('userId', userId.toString());
  return this.api.get<Task[]>(endpoints.task.base,  params );
}


  getTasksByFrequency(userId: number, frequency: string): Observable<Task[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('frequency', frequency);
    return this.api.get<Task[]>(endpoints.task.byFrequency, params);
  }

  updateTaskStatus(taskId: number, isCompleted: boolean): Observable<any> {
    return this.api.put(endpoints.task.updateStatus(taskId), { isCompleted });
  }

  deleteTask(taskId: number): Observable<any> {
    return this.api.delete(endpoints.task.delete(taskId));
  }
}
