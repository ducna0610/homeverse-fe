import { Routes } from '@angular/router';
import { UserComponent } from './layouts/user/user.component';
import { AboutComponent } from './pages/user/about/about.component';
import { ContactComponent } from './pages/user/contact/contact.component';

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
        ],
    },
];
