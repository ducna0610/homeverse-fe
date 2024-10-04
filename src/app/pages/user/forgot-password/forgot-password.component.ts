import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../common/services/user.service';
import { AlertifyService } from '../../../common/services/alertify.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertifyService: AlertifyService,) { }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.forgotPasswordForm.valid) {
      this.userService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(_ => {
        this.alertifyService.success("Vui lòng kiểm tra email để đổi mật khẩu");
      })
    }
  }

}
