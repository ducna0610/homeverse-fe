import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertifyService } from '../../../common/services/alertify.service';
import { UserService } from '../../../common/services/user.service';
import { PropertyService } from '../../../common/services/property.service';
import { PresenceService } from '../../../common/services/presence.service';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css',
})
export class UserHeaderComponent {
  totalMessageUnread = 0;
  totalBookmarked = 0;

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private alertifyService: AlertifyService,
    public userService: UserService,
    public presenceService: PresenceService,
    private propertyService: PropertyService,
  ) { }

  ngOnInit() {
    let script = this.renderer2.createElement('script');
    script.text = `
        {
          let menu = document.querySelector('.header .menu');
                  
          document.querySelector('#menu-btn').onclick = () => {
              menu.classList.toggle('active');
          }

          window.onscroll = () => {
              menu.classList.remove('active');
          }

          document.querySelectorAll('input[type="number"]').forEach(inputNumber => {
              inputNumber.oninput = () => {
                  if (inputNumber.value.length > inputNumber.maxLength) inputNumber.value = inputNumber.value.slice(0, inputNumber.maxLength);
              };
          });
        }
    `;

    this.renderer2.appendChild(this.document.body, script);

    this.presenceService.friends$.subscribe(
      data => this.totalMessageUnread = data.reduce((sum, curr) => sum + curr.messageUnread, 0)
    )

    this.propertyService.bookmarks$.subscribe(
      data => this.totalBookmarked = data.length
    )
  }

  onLogout() {
    this.userService.logout();
    this.alertifyService.success("Đăng xuất thành công");
  }
}
