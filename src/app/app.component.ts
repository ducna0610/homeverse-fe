import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './common/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
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
