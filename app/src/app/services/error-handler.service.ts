import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { first, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  snackBar: MatSnackBar = new MatSnackBar();

  public handleError(error: HttpErrorResponse): Promise<any> {

    let message = this.extractErrorMessage(error);

    switch (error.status) {
      case 0: // Network error or server not reachable
        message = 'error.network';
        break;

      case 500: // Internal server error with backend message
        message = 
          error.error?.message || 'error.server'
        ;
        break;

      case 422: // Validation error (Laravel validation response)
        const errors = error.error?.errors;
        if (errors) {
          // Get the first validation error message
          const firstKey = Object.keys(errors)[0];
          const firstMessage = errors[firstKey][0]; // Laravel returns an array of messages per field
          message = firstMessage;
        } else {
          message = 'error.validation';
        }
        break;

      case 404:
        message = 'error.not_found';
        break;

      case 403:
        message = 'error.forbidden';
        break;

      default:
        message = 'error.unknown';
        break;
    }

    // console.log(message);
    this.snackBarOpen(message);
    return Promise.reject(error);
  }

  public handleValidationError(err: any): Observable<any> {
    if (err.status === 422) {
      return of(err.error.errors);
    }
    return of(null);
  }

  private snackBarOpen(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private extractErrorMessage(error: any): string {
    const message =
      error?.error?.message ||
      error?.error?.error ||
      error?.message ||
      'messages.error.misc.generic';
    return message;
  }
}
