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
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule,ButtonModule,MessageModule,CardModule,RadioButtonModule,FormsModule,CommonModule,FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  userType: 'superAdmin' | 'visitor' = 'visitor';
  loading: boolean = false;
  errorMessage: string = '';
  showPassword:boolean = false;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService,
    private toastService:ToastService) {}

  onSubmit() {
    this.loading = true;
    this.authService.login(this.userType, this.email, this.password).subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/']); // Redirect to a dashboard or homepage
          console.log(isAuthenticated);
        } else {
          this.errorMessage = 'Invalid credentials';
          this.toastService.send({ severity: 'error', summary: 'Login Failed', detail: this.errorMessage });
        }
      },
      error: (err) => {
        this.errorMessage = 'An error occurred, please try again.';
        this.toastService.send({ severity: 'error', summary: 'Login Failed', detail: this.errorMessage });
      },
      complete: () => this.loading = false
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;  // Toggle the password visibility
  }
}
