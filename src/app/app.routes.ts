import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PropertyComponent } from './property/property.component';
import { HomeComponent } from './layout/home/home.component';
import { PropertyDetailsComponent } from './layout/property-details/property-details.component';
import { BookComponent } from './layout/book/book.component';
import { MyBookingsComponent } from './layout/my-bookings/my-bookings.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {path:'register' ,component:RegisterComponent},
    {path:'list-your-property', component:PropertyComponent},
    {path:'',component:HomeComponent},
    { path: 'property/:id', component: PropertyDetailsComponent },
    {path:'property/:id/book', component:BookComponent},
    {path:'my-bookings', component:MyBookingsComponent}
];
