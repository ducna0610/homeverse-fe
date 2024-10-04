import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateUserRequest, UserResponse } from '../../../common/models/user';
import { UserService } from '../../../common/services/user.service';
import { AlertifyService } from '../../../common/services/alertify.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

  updateProfileForm!: FormGroup;
  isSubmitted = false;
  user!: UserResponse;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertifyService: AlertifyService,
  ) { }

  ngOnInit() {
    this.userService.getProfile().subscribe(data => {
      this.user = data;
      this.updateProfileForm.patchValue({
        userName: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
      })
    })

    this.updateProfileForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      newPassword: [''],
      confirmNewPassword: [''],
    }, { validator: this.newPasswordMatchingValidator() })
  }

  newPasswordMatchingValidator() {
    return (formGroup: FormGroup) => {
      const newPasswordControl = formGroup.controls['newPassword'];
      const confirmNewPasswordControl = formGroup.controls['confirmNewPassword'];

      if (!newPasswordControl || !confirmNewPasswordControl) {
        return null;
      }

      if (newPasswordControl.value !== '' && newPasswordControl.value.length < 8) {
        newPasswordControl.setErrors({ minlength: true });
      }

      if (confirmNewPasswordControl.errors && !confirmNewPasswordControl.errors['notmatched']) {
        return null;
      }

      if (newPasswordControl.value !== confirmNewPasswordControl.value) {
        confirmNewPasswordControl.setErrors({ notmatched: true });
      } else {
        confirmNewPasswordControl.setErrors(null);
      }
      return null;
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    console.log(this.updateProfileForm);

    const request: UpdateUserRequest = {
      email: this.user.email,
      userName: this.updateProfileForm.value.userName,
      phone: this.updateProfileForm.value.phone,
      password: this.updateProfileForm.value.password,
      newPassword: this.updateProfileForm.value.newPassword,
    }

    if (this.updateProfileForm.valid) {
      console.log(request);

      this.userService.updateProfile(request).subscribe(_ => {
        this.alertifyService.success("Cập nhật tài khoản thành công");
      })
    }
  }
}
