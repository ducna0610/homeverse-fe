import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './user-footer.component.html',
  styleUrl: './user-footer.component.css',
})
export class UserFooterComponent { }
