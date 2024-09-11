import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  authService = inject(AuthService);
  router = inject(Router);
  public logout() {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
}