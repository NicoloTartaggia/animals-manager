import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AppComponent } from './app.component';
import { authGuard } from './auth/auth.guard';
import { AnimalComponent } from './animal/animal.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { 
        path: '', 
        component: AppComponent, 
        canActivate: [authGuard]
    },
    { path: 'login', component: AuthComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'home', component: AnimalComponent},
    { path: '**', redirectTo: '/login'}
];
