import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
interface Property {
  id: string;
  name: string;
  location: string;
  category: string;
  description: string;
  imgUrl: string;
  ratings: number;
  price:number;
}
@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ ButtonModule,
    InputTextModule,
    MessageModule,
    CardModule,
    RadioButtonModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    InputNumberModule,
    CalendarModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss'
})
export class BookComponent implements OnInit {
  id!: string | null;
  bookingForm!: FormGroup;
  loading = false;
  price!:number;
  totalPrice = this.price;
  roomQuantity = 1; 
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router:Router,
    private fb:FormBuilder,
    private auth:AuthService,
    private toastService: ToastService
  ) {
   
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id){
      this.loadProperty(this.id);
    }
    this.bookingForm = this.fb.group({
      propertyId: [this.id],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      roomQuantity: [this.roomQuantity, [Validators.required, Validators.min(1)]]
    });
   
    this.bookingForm.get('roomQuantity')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
  }
  loadProperty(id: string): void {
    const url = `${environment.API_URL}/property/${id}`;
    this.http.get<Property>(url).subscribe(
      (response) => {
        this.price = response.price;
        this.updateTotalPrice(); 
      },
      (error) => {
        console.error('Error fetching property data:', error);
      }
    );
  }
  updateTotalPrice(): void {
    const roomQuantity = this.bookingForm.get('roomQuantity')?.value || 1;
    this.totalPrice = roomQuantity * this.price;
  }
  
  onSubmit(): void {
    if (this.bookingForm.invalid) {
      return;
    }
  
    this.loading = true;
  
    // Extract only the required fields, and ensure propertyId is a number
  const propertyId = Number(this.bookingForm.value.propertyId);
  const { startDate, endDate } = this.bookingForm.value;
  const bookingData = { propertyId, startDate, endDate }; 
  
    if (this.auth.isAuthenticated()) {
      const jwtToken = this.auth.getToken(); // Retrieve the token from AuthService
  
      if (!jwtToken) {
        console.error('No JWT token found');
        this.loading = false;
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${jwtToken}`
      };
  
      const url = `${environment.API_URL}/visit/book`;
  
      
      this.http.post(url, bookingData, { headers }).subscribe(
        (response) => {
          this.loading = false;
          this.bookingForm.reset();

          // Show success message
          this.toastService.send({
            severity: 'success',
            summary: 'Booking Successful',
            detail: 'Your booking has been confirmed!'
          });

          // Wait for a few seconds, then navigate to the home page
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000); // Adjust the delay time as needed
        },
        (error) => {
          console.error('Booking failed:', error);
          this.loading = false;
          this.toastService.send({
            severity: 'error',
            summary: 'Booking Failed',
            detail: 'There was an issue with your booking. Please try again.'
          });
        }
      );
    } else {
      console.error('User is not authenticated');
      this.loading = false;
    }
  }
  onCancel(){
    this.router.navigate(['/']);
  }
  
}
