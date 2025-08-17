import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarSolid, faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
interface Property {
  id: string;
  name: string;
  location: string;
  category: string;
  description: string;
  imgUrl: string;
  ratings: number;
  
}

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    CardModule,
    RadioButtonModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'] // Corrected to "styleUrls"
})
export class PropertyDetailsComponent implements OnInit {
  propertyId!: string | null;
  propertyData: Property | null = null;
  faStar = faStarSolid;
  faStarEmpty = faStarEmpty;
  baseURL: string = 'http://192.168.101.27:3000/';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit(): void {
   
    this.propertyId = this.route.snapshot.paramMap.get('id');
    console.log('Property ID:', this.propertyId);

    
    if (this.propertyId) {
      this.loadProperty(this.propertyId);
    }
  }
  onBook(id:string){
    this.router.navigate(['property/',id, 'book']);
    
  }
  navigateToHome(){
    this.router.navigate(['/']);
  }
  loadProperty(id: string): void {
    const url = `${environment.API_URL}/property/${id}`;
    this.http.get<Property>(url).subscribe(
      (response) => {
        console.log(response);
        // Set the full image URL by prepending baseURL to imgUrl
        this.propertyData = {
          ...response,
          imgUrl: `${this.baseURL}${response.imgUrl}`
        };
        console.log('Property Data:', this.propertyData);
      },
      (error) => {
        console.error('Error fetching property data:', error);
      }
    );
  }
}
