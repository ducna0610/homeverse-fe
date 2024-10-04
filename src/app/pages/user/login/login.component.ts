import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../common/services/user.service';
import { AlertifyService } from '../../../common/services/alertify.service';
import { LoginRequest } from '../../../common/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertifyService: AlertifyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  onSubmit() {
    this.isSubmitted = true;

    const request: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.phone,
    };

    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.alertifyService.success('Đăng nhập thành công');
            this.router.navigate(['/']);
          }
        }
      );
    }
  }
}
