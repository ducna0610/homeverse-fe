import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PropertyService } from '../../../common/services/property.service';
import { PropertyParam } from '../../../common/models/property';
import { KeyValuePair } from '../../../common/models/keyvaluepair';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './property-filter.component.html',
  styleUrl: './property-filter.component.css',
})
export class PropertyFilterComponent {
  @Output() filterChanged = new EventEmitter<PropertyParam>();

  cityList!: any[];
  categoryTypes!: KeyValuePair[];
  sortList = [
    {value: 'createdAt', displayName: 'Ngày tạo'}, 
    {value: 'price', displayName: 'Giá'},
    {value: 'area', displayName: 'Diện tích'}
  ];

  propertyParam: PropertyParam = {
    address: '',
    category: '',
    city: '',
    furnish: '',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  }

  constructor(
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    this.propertyService.getCities().subscribe(data => {
      this.cityList = data;
    })

    this.propertyService.getCategoryTypes().subscribe(data => {
      this.categoryTypes = data;
    });
  }

  onSearch() {
    this.filterChanged.emit(this.propertyParam);
  }

}
