import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertifyService } from '../../../common/services/alertify.service';
import { RegisterRequest } from '../../../common/models/user';
import { UserService } from '../../../common/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.passwordMatchingValidator() })
  }

  passwordMatchingValidator() {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls['password'];
      const confirmPasswordControl = formGroup.controls['confirmPassword'];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['notmatched']) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ notmatched: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
      return null;
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    const request: RegisterRequest = {
      userName: this.registerForm.value.userName,
      email: this.registerForm.value.email,
      phone: this.registerForm.value.phone,
      password: this.registerForm.value.password
    };

    if (this.registerForm.valid) {
      this.userService.register(request).subscribe(() => {
        this.alertifyService.success('Chúc mừng bạn đã tạo tài khoản thành công!');
        this.alertifyService.success('Vui lòng xác minh email để đăng nhập!');
        // this.isSubmitted = false;
        // this.registerForm.reset();
      });
    } else {
      this.alertifyService.error('Vui lòng xem lại và đảm bảo cung cấp đầy đủ thông tin!');
    }
  }
}
