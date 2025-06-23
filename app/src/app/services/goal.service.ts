import { Injectable, inject } from '@angular/core';
import { Goal } from '../models/goal.model';
import { ApiService } from './api.service';
import { endpoints } from '../../environments/endpoints';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private apiService = inject(ApiService);
  user: any;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        this.user = JSON.parse(loggedInUser);
        console.log('Logged in user:', this.user);
      }
    }
  }

  saveGoal(goalData: any) {
    return this.apiService.post(endpoints.goal.create, goalData);
  }

  getAllGoalsByUserId(id: number) {
    return this.apiService.get(
      `${endpoints.goal.listByUser}?userId=${id}`
    );
  }

  updateMilestone(goalId: number, data: any) {
    return this.apiService.put(endpoints.goal.updateMilestone(goalId), data);
  }

  deleteGoal(goalId: number) {
    return this.apiService.delete(endpoints.goal.delete(goalId));
  }
}
