import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import { KeyValuePair } from '../../../common/models/keyvaluepair';
import { AlertifyService } from '../../../common/services/alertify.service';
import { PropertyService } from '../../../common/services/property.service';
import { PropertyRequest } from '../../../common/models/property';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxDropzoneModule,
    GoogleMapsModule,
  ],
  templateUrl: './post-property.component.html',
  styleUrl: './post-property.component.css',
})
export class PostPropertyComponent {
  createPropertyForm!: FormGroup;
  editor = ClassicEditor;
  public config = {
    toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
    plugins: [
      Bold, Essentials, Italic, Mention, Paragraph, Undo
    ],
  }
  isSubmitted = false;
  categoryTypes!: KeyValuePair[];
  furnishTypes!: KeyValuePair[];
  cityList!: any[];

  constructor
    (
      private fb: FormBuilder,
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

    this.createPropertyForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, Validators.required],
      area: [0, Validators.required],
      category: [0, Validators.required],
      furnish: [0, Validators.required],
      city: ["", Validators.required],
      isActive: [true, Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  onSubmit() {
    this.isSubmitted = true;

    const request: PropertyRequest = {
      title: this.createPropertyForm.value.title,
      price: this.createPropertyForm.value.price,
      area: this.createPropertyForm.value.area,
      category: this.createPropertyForm.value.category,
      furnish: this.createPropertyForm.value.furnish,
      cityId: this.createPropertyForm.value.city,
      address: this.inputField.nativeElement.value,
      lat: this.location?.lat() ?? 0,
      lng: this.location?.lng() ?? 0,
      description: this.createPropertyForm.value.description,
      images: this.files,
      isActive: this.createPropertyForm.value.isActive
    };

    if (this.createPropertyForm.valid) {
      this.propertyService.createProperty(request).subscribe(
        response => {
          this.alertifyService.success('Tạo bài đăng thành công');
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
  zoom = 6;
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