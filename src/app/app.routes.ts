import { Routes } from '@angular/router';
import { UserComponent } from './layouts/user/user.component';
import { AboutComponent } from './pages/user/about/about.component';
import { ContactComponent } from './pages/user/contact/contact.component';
import { RegisterComponent } from './pages/user/register/register.component';
import { LoginComponent } from './pages/user/login/login.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { authGuard } from './common/guards/auth.guard';
import { ForgotPasswordComponent } from './pages/user/forgot-password/forgot-password.component';
import { PostPropertyComponent } from './pages/user/post-property/post-property.component';
import { HomeComponent } from './pages/user/home/home.component';
import { PropertyDetailComponent } from './pages/user/property-detail/property-detail.component';
import { SavedComponent } from './pages/user/saved/saved.component';
import { ListingsComponent } from './pages/user/listings/listings.component';
import { SellComponent } from './pages/user/listings/sell.component';
import { RentComponent } from './pages/user/listings/rent.component';

export const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'listings',
                component: ListingsComponent,
            },
            {
                path: 'sell',
                component: SellComponent,
            },
            {
                path: 'rent',
                component: RentComponent,
            },
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
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
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
            {
                path: 'property-detail/:id',
                component: PropertyDetailComponent,
            },
            {
                path: 'post-property',
                component: PostPropertyComponent,
            },
            {
                path: 'saved',
                component: SavedComponent,
            },
        ],
    },
];
