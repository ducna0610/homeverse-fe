import { Routes } from '@angular/router';
import { UserComponent } from './layouts/user/user.component';
import { AboutComponent } from './pages/user/about/about.component';
import { ContactComponent } from './pages/user/contact/contact.component';
import { RegisterComponent } from './pages/user/register/register.component';
import { LoginComponent } from './pages/user/login/login.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: 'about',
                component: AboutComponent,
            },
            {
                path: 'contact',
                component: ContactComponent,
            },
            {
                path: 'register',
                component: RegisterComponent,
            },
            {
                path: 'login',
                component: LoginComponent,
            },
        ],
    },
    {
        path: '',
        component: UserComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent,
            },
        ],
    },
];
