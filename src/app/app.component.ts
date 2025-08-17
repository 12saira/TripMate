import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { fontAwesomeIcons } from './shared/font-awesome-icon';
import { HomeComponent } from './layout/home/home.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './layout/toast.service';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    FontAwesomeModule,
    HomeComponent,
    FooterComponent,
    NavbarComponent,
    ToastModule,
   
    HttpClientModule  // This should be the only place HttpClientModule is imported
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faIconLibrary: FaIconLibrary = inject(FaIconLibrary);
  isListingView = true;
  toastService = inject(ToastService);
  messageService = inject(MessageService);
  authService = inject(AuthService);  // Inject AuthService correctly

  ngOnInit(): void {
    this.initFontAwesome();
    this.listenToastService();
  }

  initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private listenToastService() {
    this.toastService.sendSub.subscribe({
      next: newMessage => {
        if (newMessage && newMessage.summary !== this.toastService.INIT_STATE) {
          this.messageService.add(newMessage);
        }
      }
    });
  }
}
