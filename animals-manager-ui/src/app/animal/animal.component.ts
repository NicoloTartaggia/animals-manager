import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { CreateAnimalDialogComponent, DialogData } from './create-animal-dialog/create-animal-dialog.component';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { Animal } from '../models/animal';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './animal.component.html',
  styleUrl: './animal.component.scss'
})
export class AnimalComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

  // user iformation
  jwtToken: string = '';
  username: string = '';
  role: string = '';

  // new animal data
  name: string = '';
  type: string = '';
  species: string = '';
  age: number = 0;
  gender: string = '';
  weight: number = 0;
  verse: string = '';

  // animal list
  animals: Map<String, Animal> = new Map();
  nextPageCursor: string = '';

  // show verse after click guard
  showVerseGuard: Map<string, boolean> = new Map();
  showVerse(id: string) {
    this.showVerseGuard.set(id, true)
    setTimeout(() => {
      this.showVerseGuard.set(id, false);
    }, 5000)
  }

  ngOnInit(): void {
    this.jwtToken = localStorage.getItem(environment.config.jwtTokenKey) || '';
    if (this.jwtToken.length == 0) {
      this.router.navigate(['login']);
    }
    this.username = localStorage.getItem(environment.config.usernameKey) || '';
    this.role = localStorage.getItem(environment.config.roleKey) || '';

    this.http.get(
      `${environment.config.baseDomain}/api/v1/animals`,
      {headers: new HttpHeaders().set('Authorization', this.jwtToken)}
    )
    .subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.animals.length; i ++) {
          this.animals.set(data.animals[i].id, new Animal(data.animals[i]));
          this.showVerseGuard.set(data.animals[i].id, false);
        };
        this.nextPageCursor = data.nextPageCursor;
      },
      error: error => {
        if (error.status == HttpStatusCode.Unauthorized) {
          this.logout();
        };
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateAnimalDialogComponent, {
      data: {
        name: this.name,
        type: this.type,
        species: this.species,
        age: this.age,
        gender: this.gender,
        weight: this.weight,
        verse: this.verse
      }
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (this.isUserAtLeastModifier()) {
        this.http.post(
          `${environment.config.baseDomain}/api/v1/animals`,
            {
                name: result.name,
                type: result.type,
                species: result.species,
                age: result.age,
                gender: result.gender,
                weight: result.weight,
                verse: result.verse
            },
            {headers: new HttpHeaders().set('Authorization', this.jwtToken)}
        )
        .subscribe({
          next: (data: any) => {
            this.animals.set(data.id, new Animal(data));
            this.showVerseGuard.set(data.id, false);
          },
          error: error => {
            if (error.status == HttpStatusCode.Unauthorized) {
              this.logout();
            };
          }
        });
      }
    });
  }

  async eat(id: string, currentWeight: number) {
    if (this.isUserAtLeastModifier()) {
      this.http.put(
        `${environment.config.baseDomain}/api/v1/animals/${id}`,
        {
          id: id,
          weight: currentWeight + 1
        },
        {headers: new HttpHeaders().set('Authorization', this.jwtToken)}
      )
      .subscribe({
        next: ((data: any) => {
          let currentAnimal = this.animals.get(id);
          if (currentAnimal) {
            currentAnimal.weight = data.weight;
            this.animals.set(id, currentAnimal);
          }
        }),
        error: error => {
          if (error.status == HttpStatusCode.Unauthorized) {
            this.logout();
          };
        }
      });
    }
  }

  async sleep(id: string, currentAge: number) {
    if (this.isUserAtLeastModifier()) {
      this.http.put(
        `${environment.config.baseDomain}/api/v1/animals/${id}`,
        {
          id: id,
          age: currentAge + 1
        },
        {headers: new HttpHeaders().set('Authorization', this.jwtToken)}
      )
      .subscribe({
        next: ((data: any) => {
          let currentAnimal = this.animals.get(id);
          if (currentAnimal) {
            currentAnimal.age = data.age;
            this.animals.set(id, currentAnimal);
          }
        }),
        error: error => {
          if (error.status == HttpStatusCode.Unauthorized) {
            this.logout();
          };
        }
      });
    }
  }

  async deleteAnimal(id: string) {
    if (this.isUserAdmin()) {
      this.http.delete(
        `${environment.config.baseDomain}/api/v1/animals/${id}`,
        {headers: new HttpHeaders().set('Authorization', this.jwtToken)}
      )
      .subscribe({
        error: error => {
          if (error.status == HttpStatusCode.Unauthorized) {
            this.logout();
          };
        },
        complete: () => {
          this.animals.delete(id);
        }
      });
    }
  }

  async getNextPage() {
    this.http.get(
      `${environment.config.baseDomain}/api/v1/animals?cursor=${this.nextPageCursor}`,
      {headers: new HttpHeaders().set('Authorization', this.jwtToken)}
    )
    .subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.animals.length; i ++) {
          this.animals.set(data.animals[i].id, new Animal(data.animals[i]));
          this.showVerseGuard.set(data.animals[i].id, false);
        };
        this.nextPageCursor = data.nextPageCursor;
      },
      error: error => {
        if (error.status == HttpStatusCode.Unauthorized) {
          this.logout();
        };
      }
    });
  }

  async logout() {
    localStorage.clear();
    this.animals.clear();
    this.showVerseGuard.clear();
    this.router.navigate(['/login']);
  }

  isUserAdmin(): boolean {
    return this.role === environment.roles.admin;
  }

  isUserAtLeastModifier(): boolean {
    return this.role === environment.roles.admin || this.role === environment.roles.modifier;
  }
} 
