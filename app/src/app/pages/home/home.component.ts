import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../models/goal.model';
import { AuthService } from '../../services/auth.service';
import { RemindersComponent } from "../reminders/reminders.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RemindersComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  achievedTargetValue = 0;  // to hold the achieved count value
  activeTargetValue = 0;    // to hold the active count value
  achievedDisplayValue = 0;
  activeDisplayValue = 0;
  
  authService = inject(AuthService);
  goalService = inject(GoalService);
  
  goals: Goal[] = [];
  achievedGoals: Goal[] = [];
  activeGoals: Goal[] = [];

  ngOnInit(): void {
    const userId = this.authService.currentUser?.id;
    if (userId) {
      this.goalService.getAllGoalsByUserId(userId).subscribe((goals) => {
        this.goals = goals as Goal[];
        
        // Filter goals by isAchieved status
        this.achievedGoals = this.goals.filter(goal => goal.isAchieved);
        this.activeGoals = this.goals.filter(goal => !goal.isAchieved);

        // Set target values for animation
        this.achievedTargetValue = this.achievedGoals.length;
        this.activeTargetValue = this.activeGoals.length;

        // Start animations for both counters
        this.animateAchievedCounter();
        this.animateActiveCounter();
      });
    }
  }

  // counter Animation 
  animateAchievedCounter(): void {
    const duration = 4000; // 1 second
    const steps = 30;
    const increment = Math.ceil(this.achievedTargetValue / steps);
    const intervalTime = duration / steps;

    const counter = setInterval(() => {
      this.achievedDisplayValue += increment;
      if (this.achievedDisplayValue >= this.achievedTargetValue) {
        this.achievedDisplayValue = this.achievedTargetValue;
        clearInterval(counter);
      }
    }, intervalTime);
  }

  animateActiveCounter(): void {
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = Math.ceil(this.activeTargetValue / steps);
    const intervalTime = duration / steps;

    const counter = setInterval(() => {
      this.activeDisplayValue += increment;
      if (this.activeDisplayValue >= this.activeTargetValue) {
        this.activeDisplayValue = this.activeTargetValue;
        clearInterval(counter);
      }
    }, intervalTime);
  }
}
