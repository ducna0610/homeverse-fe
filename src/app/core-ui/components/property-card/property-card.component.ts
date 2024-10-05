import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PropertyResponse } from '../../../common/models/property';
import { RouterModule } from '@angular/router';
import { TimeagoPipe } from '../../pipes/timeago.pipe';

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

}
