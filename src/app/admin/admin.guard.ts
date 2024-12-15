// src/app/admin/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        if (!localStorage.getItem('isAdminAuthenticated')) {
            this.router.navigate(['/admin']);
            return false;
        }
        return true;
    }
}
