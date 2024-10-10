import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyDetailResponse, PropertyRequest } from '../../../common/models/property';
import { KeyValuePair } from '../../../common/models/keyvaluepair';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../common/services/property.service';
import { AlertifyService } from '../../../common/services/alertify.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-update-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxDropzoneModule,
    GoogleMapsModule,
  ],
  templateUrl: './update-property.component.html',
  styleUrl: './update-property.component.css',
})
export class UpdatePropertyComponent {

  propertyId = 0;
  property!: PropertyDetailResponse;
  updatePropertyForm!: FormGroup;
  editor = ClassicEditor;
  public config = {
    toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
    plugins: [
      Bold, Essentials, Italic, Mention, Paragraph, Undo
    ]
  }
  isSubmitted = false;
  categoryTypes!: KeyValuePair[];
  furnishTypes!: KeyValuePair[];
  cityList!: any[];

  constructor
    (
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private propertyService: PropertyService,
      private alertifyService: AlertifyService,
      private router: Router,
      private ngZone: NgZone,
    ) { }

  ngOnInit() {
    this.propertyService.getCities().subscribe(data => {
      this.cityList = data;
    })

    this.propertyService.getCategoryTypes().subscribe(data => {
      this.categoryTypes = data;
    });

    this.propertyService.getFurnishTypes().subscribe(data => {
      this.furnishTypes = data;
    });

    this.updatePropertyForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, Validators.required],
      area: [0, Validators.required],
      category: [0, Validators.required],
      furnish: [0, Validators.required],
      city: ["", Validators.required],
      isActive: [true, Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.route.params.subscribe(
      (params) => {
        this.propertyId = +params['id'];
        this.propertyService.getProperty(this.propertyId).subscribe({
          next: data => {
            this.property = data as PropertyDetailResponse;
            this.property.photos.forEach(photo => {
              this.propertyService.loadImage(photo.imageUrl).subscribe(image => {
                const file = new File([image], photo.imageUrl)
                this.files.push(file);
              });
            })

            this.location = new google.maps.LatLng({
              lat: data.lat,
              lng: data.lng,
            });
            this.gotoLocation(this.location);

            this.updatePropertyForm.patchValue({
              title: this.property.title,
              price: this.property.price,
              area: this.property.area,
              isActive: this.property.isActive,
              category: this.property.categoryId,
              city: this.property.cityId,
              furnish: this.property.furnishId,
              description: this.property.description,
              address: this.property.address,
            })
          },
        });
      }
    );
  }

  onSubmit() {
    this.isSubmitted = true;

    const request: PropertyRequest = {
      title: this.updatePropertyForm.value.title,
      price: this.updatePropertyForm.value.price,
      area: this.updatePropertyForm.value.area,
      category: this.updatePropertyForm.value.category,
      furnish: this.updatePropertyForm.value.furnish,
      cityId: this.updatePropertyForm.value.city,
      address: this.updatePropertyForm.value.address,
      lat: this.location?.lat() ?? 0,
      lng: this.location?.lng() ?? 0,
      description: this.updatePropertyForm.value.description,
      images: this.files,
      isActive: this.updatePropertyForm.value.isActive
    };

    if (this.updatePropertyForm.valid) {
      this.propertyService.updateProperty(this.property.id, request).subscribe(
        response => {
          this.alertifyService.success('Cập nhật đăng thành công');
          this.router.navigate(['/property-detail', response.id]);
        }
      );
    } else {
      this.alertifyService.error('Vui lòng xem lại và đảm bảo cung cấp đầy đủ thông tin!');
    }
  }


  files: File[] = [];
  onSelectImage(event: any) {
    this.files.push(...event.addedFiles);
  }
  onRemoveImage(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  center: google.maps.LatLngLiteral = {
    lat: 11,
    lng: 106
  };
  zoom = 17;
  location: google.maps.LatLng | undefined;

  @ViewChild('map', { static: true })
  map!: GoogleMap;
  markerPosition!: google.maps.LatLng;

  @ViewChild('inputField')
  inputField!: ElementRef;
  autocomplete: google.maps.places.Autocomplete | undefined;

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputField.nativeElement
    );

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete?.getPlace();

        this.location = place?.geometry?.location;

        this.gotoLocation(this.location!);
      });
    });
  }

  gotoLocation(location: google.maps.LatLng) {
    this.markerPosition = location;
    this.map.panTo(location);
    this.zoom = 17;
  }

  ngOnDestroy() {
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }
}
