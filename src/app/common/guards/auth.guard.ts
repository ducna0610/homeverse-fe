import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';

export const authGuard: CanActivateFn = (childRoute, state) => {
  const userService = inject(UserService);
  const alertifyService = inject(AlertifyService);

  if (userService.currentUser()) return true;
  else {
      alertifyService.error('Bạn cần đăng nhập để tiếp tục!');
      return false;
  }
};
