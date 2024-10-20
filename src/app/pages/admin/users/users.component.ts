import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserResponse } from '../../../common/models/user';
import { UserService } from '../../../common/services/user.service';
import { AlertifyService } from '../../../common/services/alertify.service';
import { FilterPipe } from '../../../core-ui/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterPipe,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  
  search = '';
  users = new Array<UserResponse>();

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data
      }, error => {
        console.log(error);
      }
    )
  }

  onDelete(id: number) {
    if (confirm('Bạn có muốn xóa user?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.users = this.users.filter(x => x.id !== id);
          this.alertifyService.success('Xóa user thành công');
        }, error => {
          console.log(error);
        }
      )
    }
  }
}
