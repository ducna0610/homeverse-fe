import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { PropertyDetailResponse, PropertyResponse } from '../../../common/models/property';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { PropertyService } from '../../../common/services/property.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlertifyService } from '../../../common/services/alertify.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GoogleMapsModule,
  ],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyDetailComponent {

  propertyId = 0;
  property!: PropertyDetailResponse;
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  zoom = 18;

  @ViewChild('map', { static: true })
  map!: GoogleMap;
  markerPosition!: google.maps.LatLng;

  constructor
  (
    private route: ActivatedRoute,
    private location: Location,
    public propertyService: PropertyService,
    public alertifyService: AlertifyService,
  ) { }

  ngOnInit() {

    this.route.params.subscribe(
      (params) => {
        this.propertyId = +params['id'];
        this.propertyService.getProperty(this.propertyId).subscribe({
          next: data => {
            this.property = data as PropertyDetailResponse;
            this.center.lat = data.lat;
            this.center.lng = data.lng;
            this.markerPosition = new google.maps.LatLng(this.center);
          },
          error: error => console.log(error)
        });
      }
    );
  }

  setBookmark(property: PropertyResponse) {
    if (this.propertyService.isBookmarked(property.id)) {
      this.propertyService.deleteBookmark(this.property.id).subscribe(
        _ =>
          this.alertifyService.success("Đã xóa")
      );
    } else {
      this.propertyService.createBookmark(this.property).subscribe(
        _ => 
          this.alertifyService.success("Đã lưu")
      );
    }
  }

  backClicked() {
    this.location.back();
  }
}
