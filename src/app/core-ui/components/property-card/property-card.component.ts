import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PropertyResponse } from '../../../common/models/property';
import { RouterModule } from '@angular/router';
import { TimeagoPipe } from '../../pipes/timeago.pipe';
import { PropertyService } from '../../../common/services/property.service';
import { AlertifyService } from '../../../common/services/alertify.service';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TimeagoPipe,
  ],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css',
})
export class PropertyCardComponent {

  @Input() property!: PropertyResponse;
  @Output() removePropertyEvent = new EventEmitter<number>();

  constructor(
    private propertyService: PropertyService,
    private alertifyService: AlertifyService
  ) { }

  isBookmarked() {
    return this.propertyService.isBookmarked(this.property.id);
  }

  setBookmark() {
    if (this.isBookmarked()) {
      this.removePropertyEvent.emit(this.property.id);
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
}
