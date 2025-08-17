import { Component } from '@angular/core';

import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';  // Import CardModule for p-card
import { RadioButtonModule } from 'primeng/radiobutton';  // Import RadioButtonModule for p-radioButton
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastService } from '../layout/toast.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputTextModule,ButtonModule,MessageModule,CardModule,RadioButtonModule,FormsModule,CommonModule,FontAwesomeModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name: string = '';  // New name field
  email: string = '';
  password: string = '';
  userType: 'superAdmin' | 'visitor' = 'visitor'; // Default to 'visitor'
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  // Handle form submission
  onSubmit(): void {
    this.loading = true;
    this.authService.register(this.userType, this.name, this.email, this.password).subscribe(
      response => {
        this.toastService.send({ severity: 'success', summary: 'Registration Successful' });
        this.router.navigate(['/login']); // Navigate to login page after successful registration
      },
      error => {
        this.toastService.send({ severity: 'error', summary: 'Registration Failed', detail: error.message });
      },
      () => {
        this.loading = false;
      }
    );
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
