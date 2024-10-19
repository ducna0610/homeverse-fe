import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertifyService } from '../../../common/services/alertify.service';
import { UserService } from '../../../common/services/user.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private alertifyService: AlertifyService,
    public userService: UserService,
  ) { }

  ngOnInit() {
    let script = this._renderer2.createElement('script');
    script.text = `
      {
        let header = document.querySelector('.header');

        document.querySelector('#menu-btn').onclick = () =>{
          header.classList.add('active');
        }

        document.querySelector('#close-btn').onclick = () =>{
          header.classList.remove('active');
        }

        window.onscroll = () =>{
          header.classList.remove('active');
        }

        document.querySelectorAll('input[type="number"]').forEach(inputNumbmer => {
          inputNumbmer.oninput = () =>{
              if(inputNumbmer.value.length > inputNumbmer.maxLength) inputNumbmer.value = inputNumbmer.value.slice(0, inputNumbmer.maxLength);
          }
        });
      }
  `;

    this._renderer2.appendChild(this._document.body, script);
  }

  onLogout() {
    if (!confirm('Bạn có muốn đăng xuất?')) {
      return;
    }
    this.userService.logout();
    this.alertifyService.success("Đăng xuất thành công");
  }
}
