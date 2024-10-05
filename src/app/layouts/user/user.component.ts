import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { UserHeaderComponent } from '../../core-ui/components/user-header/user-header.component';
import { UserFooterComponent } from '../../core-ui/components/user-footer/user-footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    UserHeaderComponent,
    UserFooterComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent { }
