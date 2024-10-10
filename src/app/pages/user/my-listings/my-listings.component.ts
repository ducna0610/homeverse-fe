import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PropertyService } from '../../../common/services/property.service';
import { PropertyResponse } from '../../../common/models/property';
import { RouterModule } from '@angular/router';
import { AlertifyService } from '../../../common/services/alertify.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.css',
})
export class MyListingsComponent {
  properties = new Array<PropertyResponse>();

  constructor(
    private propertyService: PropertyService,
    private alertifyService: AlertifyService,
  ) { }

  ngOnInit() {
    this.propertyService.getPropertiesForUser().subscribe(
      data => {
        this.properties = data
      }, error => {
        console.log(error);
      }
    )
  }

  onDelete(id: number) {
    if (!confirm('Bạn có muốn xóa bài đăng?')) {
      return;
    }
    this.propertyService.deleteProperty(id).subscribe(
      () => {
        this.properties = this.properties.filter(x => x.id !== id);
        this.alertifyService.success('Xóa bài đăng thành công');
      }, error => {
        console.log(error);
      }
    )
  }

}
