import { Component, OnInit } from '@angular/core';


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
import { ToastService } from '../toast.service';
import { faStar as faStarSolid, faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

import {ActivatedRoute} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth.service';

interface Property {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
  description: string;
  category:string;
  location:string;
  ratings:number;
}
// Define an interface for the RecommendationItem
interface RecommendationItem {
  property: Property;
  similarityScore: number;
}

// Define an interface for the API response
interface RecommendationResponse {
  message: string;
  data: RecommendationItem[];
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,ButtonModule,MessageModule,CardModule,RadioButtonModule,FormsModule,CommonModule,FontAwesomeModule
  ],
  providers:[],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchText: string = ''; 
  properties: Property[] = [];
  filteredDestinations:any;
  recommended!:boolean;
  baseURL: string = 'http://192.168.101.27:3000/';
  recommendBtn!:boolean;
  exploreBtn:boolean = false;
  faStar = faStarSolid;
  faStarEmpty = faStarEmpty;
  constructor(private http: HttpClient, private router: Router,
    private auth:AuthService) {}

  ngOnInit(): void {
    this.loadProperties();
    if(this.auth.isAuthenticated()){
      this.recommendBtn= true;
      
      
    }
    else{
      this.recommendBtn = false;
    }
    console.log(this.recommendBtn);
  }

  loadProperties() {
    const url = `${environment.API_URL}/property`;
    this.http.get<Property[]>(url).subscribe(
      (response) => {
        this.properties = response.map(property => ({
          ...property,
          imgUrl: `${this.baseURL}${property.imgUrl}`
        }));
        this.filteredDestinations = [...this.properties];
      },
      (error) => {
        console.error('Error fetching properties:', error);
      }
    );
  }
  filterDestinations() {
    const searchLower = this.searchText.toLowerCase();
    this.filteredDestinations = this.properties.filter(destination =>
      destination.name.toLowerCase().includes(searchLower) ||
      destination.location.toLowerCase().includes(searchLower)
    );
  }

  onBook(propertyId: number) {
    this.router.navigate(['/book', propertyId]);
  }
  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index);
  }
  onViewMore(id:number | null){
    this.router.navigate(['/property',id]);
  }
  goToExplore(){
    this.router.navigate(['/']);
    this.recommendBtn = true;
    this.exploreBtn = false;
    this.loadProperties();

  }
  getRecommendations(){
    if (this.auth.isAuthenticated()) {
      const jwtToken = this.auth.getToken(); // Retrieve the token from AuthService
  
      if (!jwtToken) {
        console.error('No JWT token found');
       
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${jwtToken}`
      };
  
      const url = `${environment.API_URL}/visit/recommendations`;
    this.http.get<RecommendationResponse>(url, { headers }).subscribe(
      (response) => {
        this.exploreBtn = true;
        this.recommendBtn = false;
        this.filteredDestinations = response.data.map((item: RecommendationItem) => ({
          ...item.property,
          similarityScore: item.similarityScore,
          imgUrl: `${this.baseURL}${item.property.imgUrl}`
        }));
        console.log('Recommended properties:', this.properties);
      },
      (error) => {
        console.error('Error fetching properties:', error);
      }
    );
  }

}
}