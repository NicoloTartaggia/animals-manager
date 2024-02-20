import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { environment } from '../environments/environment';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  constructor(private http: HttpClient, private router: Router) {}

  allowedRoles = ['Admin', 'Modifier', 'Reader'];

  formBuilder = inject(FormBuilder);
  form = this.formBuilder.nonNullable.group({
    username: [''],
    password: [''],
    role: ['']
  });
  wrongCredentials = false;

  async signUp() {
    this.http.post(
      `${environment.config.baseDomain}/api/v1/auth/signup`,
      {
          username: this.form.getRawValue().username,
          password: this.form.getRawValue().password,
          role: this.form.getRawValue().role
      })
      .subscribe({
        next: (data: any) => {
          localStorage.setItem(environment.config.jwtTokenKey, `Bearer ${data}`);
          const decodedJwt = jwtDecode<User>(`${data}`)
          localStorage.setItem(environment.config.usernameKey, decodedJwt.username);
          localStorage.setItem(environment.config.roleKey, decodedJwt.role);
        },
        error: error => {
          this.wrongCredentials = true;
        },
        complete: () => {
          this.wrongCredentials = false;
          this.router.navigate(['home']);
      }
    });
  };
}
