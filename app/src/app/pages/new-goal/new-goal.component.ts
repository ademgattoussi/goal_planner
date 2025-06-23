import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-goal',
  imports: [ReactiveFormsModule],
  templateUrl: './new-goal.component.html',
  styleUrl: './new-goal.component.scss',
})
export class NewGoalComponent {
  today = new Date().toISOString().split('T')[0];
  auth = inject(AuthService);
  constructor() {
    this.initializeForm();
    this.addMilestone();

    if (typeof window !== 'undefined' && window.localStorage) {
      const loggedInUser = this.auth.currentUser;
      if (loggedInUser) {
        this.goalForm.patchValue({
          userId: loggedInUser.id,
        });
        console.log('Logged in user:', loggedInUser);
      }
    }
  }

  router = inject(Router);
  goalService = inject(GoalService);
  goalForm: FormGroup = new FormGroup({});

  initializeForm() {
    this.goalForm = new FormGroup({
      goalId: new FormControl(0),
      goalName: new FormControl(''),
      description: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      userId: new FormControl(''),
      isAchieved: new FormControl(false),
      milestones: new FormArray([]),
    });
  }

  get milestoneList() {
    return this.goalForm.get('milestones') as FormArray;
  }

  addMilestone() {
    const milestoneForm = new FormGroup({
      milestoneId: new FormControl(0),
      milestoneName: new FormControl(''),
      description: new FormControl(''),
      targetDate: new FormControl(''),
      isCompleted: new FormControl(false),
    });
    this.milestoneList.push(milestoneForm);
  }
  removeMilestone(index: number) {
    this.milestoneList.removeAt(index);
  }
  onSubmit() {
    const formValue = this.goalForm.value;
    console.log('Form Value:', formValue);
    this.goalService.saveGoal(formValue).subscribe(
      (response) => {
        console.log('Goal saved successfully:', response);
        this.initializeForm(); // Reset the form after successful submission
        this.router.navigate(["/goals"]);
      },
      (error) => {
        console.error('Error saving goal:', error);

        alert('Error saving goal. Please try again later.');
      }
    );
  }
}
