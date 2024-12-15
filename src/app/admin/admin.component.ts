import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [FormsModule, CommonModule],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div class="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-bold mb-6 text-center dark:text-white">Admin Login</h2>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              [class.border-red-500]="errorMessage"
            >
          </div>
          
          <div *ngIf="errorMessage" class="text-red-500 text-sm mb-4">
            {{ errorMessage }}
          </div>
          
          <button
            type="submit"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  `
})
export class AdminComponent {
    password: string = '';
    errorMessage: string = '';

    constructor(private router: Router) {}

    onSubmit(): void {
        const validPassword = 'admin123'; // Replace with secure authentication
        if (this.password === validPassword) {
            localStorage.setItem('isAdminAuthenticated', 'true');
            this.router.navigate(['/admin-dashboard']);
        } else {
            this.errorMessage = 'Invalid password';
        }
    }
}
