import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { UserService } from "../services/user.service";
import { AlertifyService } from "../services/alertify.service";

export const adminGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const alertifyService = inject(AlertifyService);

    if (userService.isAdmin()) return true;
    else {
        alertifyService.error('Bạn không có quyền truy cập!');
        return false;
    }
};