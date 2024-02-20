import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
    constructor(private http: HttpClient, private router: Router) {}

    formBuilder = inject(FormBuilder);
    form = this.formBuilder.nonNullable.group({
        username: [''],
        password: ['']
    })
    wrongCredentials = false;


    async signIn() {
        this.http.post(
            `${environment.config.baseDomain}/api/v1/auth/signin`,
            {
                username: this.form.getRawValue().username,
                password: this.form.getRawValue().password
            }
        )
        .subscribe({
            next: (data: any) => {
                localStorage.setItem(environment.config.jwtTokenKey, `Bearer ${data}`);
                const decodedJwt = jwtDecode<User>(`${data}`);  
                localStorage.setItem(environment.config.usernameKey, decodedJwt.username);
                localStorage.setItem(environment.config.roleKey, decodedJwt.role);
            },
            error: error => {
                this.wrongCredentials = true;
            },
            complete: () => {
                this.wrongCredentials = false;
                this.router.navigate(['/home']);
            }
        })
    };

    async signOut() {
        localStorage.clear;
        this.router.navigate(['/login']);
    };
}
