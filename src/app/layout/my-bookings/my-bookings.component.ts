import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../toast.service';
import { HttpClient } from '@angular/common/http';
interface Property {
  id: number;
  name: string;
  email: string | null;
  category: string;
  location: string;
  description: string;
  price: number;
  imgUrl: string;
  imgDocUrl: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  password: string | null;
}

interface Rate {
  id: number;
  rating_score: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  property: Property;
  rate: Rate | null;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    CardModule,
    RadioButtonModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    InputNumberModule,
    CalendarModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit{
  bookings: Booking[] = []; // Array of bookings
  bookingForms: { [key: number]: FormGroup } = {};
  
  editingBooking: number | null = null; 
  editForm: FormGroup; 
  ratingForm!: FormGroup; 
  baseUrl = environment.API_URL; 
  imageBaseUrl = `${environment.API_URL}/`;

  constructor(private http: HttpClient, private fb: FormBuilder,
    private auth: AuthService,
    private toastService: ToastService) {
    this.editForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      roomQuantity: ['']
    });

   
  }

  ngOnInit(): void {
    this.getBookings();
  }
  getImageUrl(imgPath: string): string {
    return `${this.imageBaseUrl}${imgPath}`;
  }

  
  getBookings() {
    if (this.auth.isAuthenticated()) {
      const jwtToken = this.auth.getToken(); 
  
      if (!jwtToken) {
        console.error('No JWT token found');
        
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${jwtToken}`
      };
  
      const url = `${environment.API_URL}/visit/get-my-bookings`;
  
   
    this.http.get(url,{headers}).subscribe((data: any) => {
      this.bookings = data;
      // Initialize a form for each booking
      this.bookings.forEach(booking => {
        this.bookingForms[booking.id] = this.buildForm(booking);
      });
    });
  }
  }
  buildForm(booking: Booking): FormGroup {
    return this.fb.group({
      rating_score: [{ value: booking.rate?.rating_score || '', disabled: !!booking.rate }, Validators.required],
      review: [{ value: booking.rate?.review || '', disabled: !!booking.rate }, Validators.required],
      property: [booking.property.id],
      visit: [booking.id]
    });
  }
  editBooking(booking: any) {
    this.editingBooking = booking.id;
    this.editForm.patchValue({
      startDate: booking.startDate,
      endDate: booking.endDate,
      roomQuantity: booking.roomQuantity
    });
  }

  
  submitEdit(bookingId: number) {
    const updatedBooking = this.editForm.value;
    const url = `${this.baseUrl}/update-booking/${bookingId}`;
    this.http.put(url, updatedBooking).subscribe(() => {
      this.getBookings();
      this.editingBooking = null;
    });
  }

 
  submitRating(bookingId: number, propertyId: number) {
    if (this.auth.isAuthenticated()) {
      const jwtToken = this.auth.getToken();
      if (!jwtToken) {
        console.error('No JWT token found');
        return;
      }
      const headers = {
        Authorization: `Bearer ${jwtToken}`
      };
      
      const url = `${environment.API_URL}/visit/rate`;
      const form = this.bookingForms[bookingId];
      
      if (!form) {
        console.error('Form not found for booking ID:', bookingId);
        return;
      }
      
      const payload = {
        ...form.getRawValue(), // Retrieves all form control values
        property: propertyId,
        visit: bookingId
      };
      
      this.http.post(url, payload, { headers })
        .subscribe(
          (response) => {
            this.getBookings();
            this.toastService.send({
              severity: 'success',
              summary: 'Rating Successful',
              detail: 'Your rating has been confirmed!'
            });
          },
          (error) => {
            console.error('Booking failed:', error);
            this.toastService.send({
              severity: 'error',
              summary: 'Booking Failed',
              detail: 'There was an issue with your booking. Please try again.'
            });
          }
        ); 
    }
  }
  
  }
  

