import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../core-ui/pipes/filter.pipe';
import { ContactResponse } from '../../../common/models/contact';
import { ContactService } from '../../../common/services/contact.service';
import { AlertifyService } from '../../../common/services/alertify.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterPipe,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {
  
  search = '';
  contacts = new Array<ContactResponse>();

  constructor(
    private contactService: ContactService,
    private alertifyService: AlertifyService,
  ) { }

  ngOnInit() {
    this.contactService.getContacts().subscribe(
      data => {
        this.contacts = data
      }, error => {
        console.log(error);
      }
    )
  }

  onDelete(id: number) {
    if (confirm('Bạn có muốn xóa contact?')) {
      this.contactService.deleteContact(id).subscribe(
        () => {
          this.contacts = this.contacts.filter(x => x.id !== id);
          this.alertifyService.success('Xóa contact thành công');
        }, error => {
          console.log(error);
        }
      )
    }
  }
}
