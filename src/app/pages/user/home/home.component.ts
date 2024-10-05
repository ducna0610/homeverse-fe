import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PropertyResponse } from '../../../common/models/property';
import { PropertyService } from '../../../common/services/property.service';
import { PropertyCardComponent } from '../../../core-ui/components/property-card/property-card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PropertyCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  properties = new Array<PropertyResponse>();

  constructor(
    private propertyService: PropertyService, 
  ) { }

  ngOnInit() {
    this.propertyService.getProperties().subscribe(
      data => {
        this.properties = data.slice(0, 6)
      }, error => {
        console.log(error);
      }
    )
  }
}