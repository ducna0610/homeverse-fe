import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../common/services/user.service';
import { RouterModule } from '@angular/router';
import { ContactService } from '../../../common/services/contact.service';
import { PropertyService } from '../../../common/services/property.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

  totalProperty = 0;
  totalUser = 0;
  totalContact = 0;

  constructor(
    public userService: UserService,
    private propertyService: PropertyService,
    private contactService: ContactService,
  ) { }
  
  ngOnInit() {
    this.propertyService.getAllProperties().subscribe(
      data => this.totalProperty = data.length
    )

    this.userService.getUsers().subscribe(
      data => this.totalUser = data.length
    )

    this.contactService.getContacts().subscribe(
      data => this.totalContact = data.length
    )
  }
}
