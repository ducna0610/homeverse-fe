import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PropertyResponse } from '../../../common/models/property';
import { PropertyService } from '../../../common/services/property.service';
import { RouterModule } from '@angular/router';
import { PropertyCardComponent } from '../../../core-ui/components/property-card/property-card.component';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PropertyCardComponent,
  ],
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css',
})
export class SavedComponent {
  properties = new Array<PropertyResponse>();

  constructor(
    private propertyService: PropertyService,
  ) { }

  ngOnInit() {
    this.propertyService.bookmarks$.subscribe(
      data => this.properties = data
    )
  }

  removeProperty(id: number) {
    this.properties = this.properties.filter(p => p.id !== id);
  }
}
