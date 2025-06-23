import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { Goal, Milestone } from '../../models/goal.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.scss'
})
export class GoalListComponent implements OnInit {

  auth = inject(AuthService);
  router = inject(Router);
  goalService = inject(GoalService);

  goals: Goal[] = [];

  ngOnInit(): void {
    this.getAllGoalsCreatedByMe();
  }

  navigateToNewGoal() {
    this.router.navigate(['/dashboard/new-goal',]);
  }
  
  getAllGoalsCreatedByMe() {
    const user = this.auth.currentUser;  // Get the user from goalService

    if (!user || !user.id) {
      console.warn('User not logged in');
      return;
    }

    console.log('Fetching goals for user:', user.id); // Add a log to check the user ID

    this.goalService.getAllGoalsByUserId(user.id).subscribe(
      (response) => {
        this.goals = response as Goal[];
        this.goals = this.goals.filter(goal => !goal.isAchieved);
        console.log('Fetched goals:', this.goals);  // Log the fetched goals
      },
      (error) => {
        console.error('Error fetching goals:', error);
      }
    );
  }

  // Helper methods for template calculations
  getCompletedCount(milestones: Milestone[]): number {
    return milestones.filter(m => m.isCompleted).length;
  }

  calculateProgress(milestones: Milestone[]): number {
    if (!milestones || milestones.length === 0) return 0;
    
    const completed = this.getCompletedCount(milestones);
    return Math.round((completed / milestones.length) * 100);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  deleteGoal(goalId: number): void {
    if (!goalId) {
      console.warn('Invalid goal ID');
      return;
    }

    this.goalService.deleteGoal(Number(goalId)).subscribe(
      () => {
        console.log(`Goal with ID ${goalId} deleted successfully`);
        this.goals = this.goals.filter(goal => goal.goalId !== Number(goalId)); // Remove the deleted goal from the list
      },
      (error) => {
        console.error('Error deleting goal:', error);
      }
    );
  }

  toggleMilestoneCompletion(milestone: Milestone) {
    milestone.isCompleted = !milestone.isCompleted;
    this.goalService.updateMilestone(milestone.milestoneId, milestone).subscribe(
      (response) => {
        console.log('Milestone updated:', response);
      },
      (error) => {
        console.error('Error updating milestone:', error);
      }
    );
  }
}