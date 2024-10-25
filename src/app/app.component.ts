import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './common/services/user.service';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSpinnerComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'homeverse';

  constructor(
    private userService: UserService,
  ) {
    userService.setCurrentUser();
  }
}
