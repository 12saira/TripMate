import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { environment } from '../../environments/environment';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../layout/toast.service';
interface Feature {
  featureId: number;
  name: string;
  status: boolean;
}

@Component({
  selector: 'app-property',
  standalone: true,
  imports: [InputTextModule, ButtonModule, MessageModule, CardModule,
    RadioButtonModule, FormsModule, CommonModule, FontAwesomeModule, ReactiveFormsModule,
    DropdownModule, CheckboxModule,FileUploadModule,ToastModule],
  providers: [MessageService],
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  uploadedImage: string | null = null; // Image preview
  uploadedDoc: string | null = null; // Document preview
  imageFile: File | null = null; // Image file to upload
  docFile: File | null = null; // Document file to upload
  selectedFile: File | null = null;
  filePreview: { imgUrl?: string; imgDocUrl?: string } = {};
  availableFeatures = [
    { featureId: 1, name: 'Air Conditioning', status: false },
    { featureId: 2, name: 'Swimming Pool', status: false },
    { featureId: 3, name: 'Garage', status: false },
    { featureId: 4, name: 'Gym', status: false },
    { featureId: 5, name: 'Garden', status: false },
    { featureId: 6, name: 'Balcony', status: false },
    { featureId: 7, name: 'Wi-Fi', status: false },
    { featureId: 8, name: 'Security', status: false },
    { featureId: 9, name: 'Furnished', status: false },
    { featureId: 10, name: 'Pet-Friendly', status: false }
  ];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private toastService:ToastService
  ) {}

  ngOnInit(): void {
    this.propertyForm = this.fb.group({
      name: ['', Validators.required],
      email:['',Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      features: this.fb.array(
        this.availableFeatures.map((item) =>
          this.fb.group({
            featureId: [item.featureId],
            name: [item.name],
            status: [item.status]
          })
        )
      )
    });
  }

  get features(): FormArray {
    return this.propertyForm.get('features') as FormArray;
  }
// Method to handle file selection for both imgUrl and imgDocUrl
onFileSelect(event: Event, fieldName: 'imgUrl' | 'imgDocUrl') {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput?.files && fileInput.files[0]) {
    const selectedFile = fileInput.files[0];
    
    // Create a preview of the selected file
    const reader = new FileReader();
    reader.onload = () => {
      // Assign the preview URL to the correct field
      this.filePreview[fieldName] = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);

    // Set the selected file to the correct variable
    if (fieldName === 'imgUrl') {
      this.imageFile = selectedFile;
    } else if (fieldName === 'imgDocUrl') {
      this.docFile = selectedFile;
    }
  }
}

  onSubmit() {
    if (this.propertyForm.valid && this.imageFile && this.docFile) {
      const formData = new FormData();

     
      formData.append('name', this.propertyForm.get('name')?.value);
      formData.append('email', this.propertyForm.get('email')?.value);
      formData.append('category', this.propertyForm.get('category')?.value);
      formData.append('location', this.propertyForm.get('location')?.value);
      formData.append('description', this.propertyForm.get('description')?.value);
      formData.append('price', this.propertyForm.get('price')?.value);

    
      const features = this.propertyForm.get('features')?.value;
      formData.append('features', JSON.stringify(features));

      formData.append('imgUrl', this.imageFile, this.imageFile.name);
      formData.append('imgDocUrl', this.docFile, this.docFile.name);

     
      const url = `${environment.API_URL}/property/register`;
      this.http.post(url, formData).subscribe(
        (response) => {
          this.toastService.send({ severity: 'success', summary: 'Success', detail: 'Property registered successfully!' });
          this.propertyForm.reset();
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error registering property:', error);
          this.toastService.send({ severity: 'error', summary: 'Error', detail: 'Could not register property.' });
        }
      );
    } else {
      this.toastService.send({ severity: 'warn', summary: 'Incomplete Form', detail: 'Please complete all required fields and upload both images.' });
    }
  }
}

  // Submit the property form
  // onSubmit() {
  //   if (this.propertyForm.valid) {
  //     this.http.post('/property/register', this.propertyForm.value).subscribe(
  //       (response) => {
  //         this.messageService.add({ severity: 'success', summary: 'Property Registered', detail: 'Property has been registered successfully!' });
  //         this.propertyForm.reset();
  //         this.features.clear();
  //       },
  //       (error) => {
  //         console.error('Error registering property:', error);
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not register property.' });
  //       }
  //     );
  //   }
  // }




 
