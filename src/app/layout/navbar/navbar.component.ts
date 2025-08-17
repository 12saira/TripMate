import {Component, effect, inject, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ToolbarModule} from "primeng/toolbar";
import {MenuModule} from "primeng/menu";
import { AuthService } from '../../core/auth.service';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {MenuItem} from "primeng/api";
import { ToastService } from '../toast.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ ButtonModule,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    CommonModule
  ],
  providers:[DialogService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
loggedIn: boolean | undefined;
toastService: ToastService = inject(ToastService);
auth:AuthService = inject(AuthService);
constructor(
  private router:Router
){

}
ngOnInit(): void {
  this.toastService.send({ severity: 'info', summary: 'Welcome to TripMate' });
  
  // Subscribe to loggedIn$ to get real-time updates
  this.auth.loggedIn$.subscribe(status => {
    this.loggedIn = status;
  });
}

onLogin() {
  this.router.navigate(['/login']);
}

onSignup() {
  this.router.navigate(['/register']);
}

onLogout() {
  this.auth.logout();
  this.toastService.send({ severity: 'success', summary: 'Logged out successfully' });
  this.router.navigate(['/']);
  window.location.href='/';  // Redirect after logout
}
onPropertyClick(){
  this.router.navigate(['/list-your-property']);
}
myBookings(){
  this.router.navigate(['/my-bookings']);
}
}
