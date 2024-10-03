import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-footer',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-footer.component.html',
  styleUrl: './user-footer.component.css',
})
export class UserFooterComponent { }
