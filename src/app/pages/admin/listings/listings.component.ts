import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PropertyService } from '../../../common/services/property.service';
import { PropertyResponse } from '../../../common/models/property';
import { FilterPipe } from '../../../core-ui/pipes/filter.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertifyService } from '../../../common/services/alertify.service';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FilterPipe,
  ],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css',
})
export class ListingsComponent { 
  
  search = '';
  properties = new Array<PropertyResponse>();

  constructor(
    private propertyService: PropertyService,
    private alertifyService: AlertifyService,
  ) { }

  ngOnInit() {
    this.propertyService.getAllProperties().subscribe(
      data => {
        this.properties = data
      }, error => {
        console.log(error);
      }
    )
  }

  onDelete(id: number) {
    if (confirm('Bạn có muốn xóa bài đăng?')) {
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
}
