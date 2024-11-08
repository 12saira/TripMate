import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'app/environment/environment';
import { Observable } from 'rxjs';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    private baseUrl = environment.backendapiUrl;
    
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
      
        private http :HttpClient
    ) {}

    
    ngOnInit(): void {
       

        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required],
            userType:['superAdmin'],
           
            
        });
    }

    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        
        const loginData: logindto = this.signInForm.value;
        console.log(loginData);
        this.post(loginData, 'superAdmin').subscribe((response)=>{
          if(response.message === 'Login successful'){
            debugger;
            localStorage.setItem(
                       'userDetailToken',
                    JSON.stringify(response.token)
             );
              // Navigate to the redirect url
         this._router.navigate(['/dashboards/project']);
       
          }
        });
        // Sign in
      
        // subscribe({
        //     next: (response) => {
        //         console.log(response);
        //         // if (response.message === 'Login successful') {
        //         //     localStorage.setItem(
        //         //         'userDetail',
        //         //         JSON.stringify(response.data)
        //         //     );

        //         //     // Navigate to the redirect url
        //         //     this._router.navigateByUrl('/landing');
        //         // } else {
        //         //     const res = JSON.parse(response.response);
        //         //     // this._matsnackService.callSnackBar(res.message, 'error');
        //         //     this.signInForm.enable();
        //         // }
        //     },
        //     error: (error: any) => {
        //         const res: any = error;

        //         // Re-enable the form
        //         this.signInForm.enable();

        //         // Reset the form
        //         this.signInNgForm.resetForm();

        //         // Set the alert
        //         this.alert = {
        //             type: 'error',
        //             message: error.message,
        //         };

        //         // Show the alert
        //         this.showAlert = true;
        //     },
        // });
      
    }


    post(form: logindto, userType:string): Observable<any>{
        const params = new HttpParams().set('userType', userType);
        return  this.http.post(this.baseUrl + '/auth/login', form,{
           params
        });
        
    }

   
}

interface logindto{
    email: string,
    password: string
   

}
