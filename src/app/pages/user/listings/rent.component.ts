import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PropertyService } from '../../../common/services/property.service';
import { PropertyParam, PropertyResponse } from '../../../common/models/property';
import { RouterModule } from '@angular/router';
import { PropertyCardComponent } from '../../../core-ui/components/property-card/property-card.component';
import { PropertyFilterComponent } from '../../../core-ui/components/property-filter/property-filter.component';
import { SortPipe } from '../../../core-ui/pipes/sort.pipe';
import { FilterPipe } from '../../../core-ui/pipes/filter.pipe';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PropertyCardComponent,
    PropertyFilterComponent,
    SortPipe,
    FilterPipe,
  ],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css',
})
export class RentComponent {
  properties = new Array<PropertyResponse>();
  bookmarks = new Array<number>();

  propertyParam: PropertyParam = {
    address: '',
    category: 'Cho thuê',
    city: '',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  }

  constructor(
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    this.propertyService.getProperties().subscribe(
      data => {
        this.properties = data
      }, error => {
        console.log(error);
      }
    )
  }

}
