import { Component, Inject, input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { FormsModule, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {
  name: string;
  type: string;
  species: string;
  age: number;
  gender: string;
  weight: number;
  verse: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
} 

@Component({
  selector: 'app-create-animal-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule
  ],
  templateUrl: './create-animal-dialog.component.html',
  styleUrl: './create-animal-dialog.component.scss'
})
export class CreateAnimalDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateAnimalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  genderOptions = ['Male', 'Female'];

  inputNameFormControl = new FormControl(this.data.name, [Validators.required]);
  inputTypeFormControl = new FormControl(this.data.type, [Validators.required]);
  inputSpeciesFormControl = new FormControl(this.data.species, [Validators.required]);
  inputAgeFormControl = new FormControl(this.data.age, [Validators.required]);
  inputGenderFormControl = new FormControl(this.data.gender, [Validators.required]);
  inputWeightFormControl = new FormControl(this.data.weight, [Validators.required]);
  inputVerseFormControl = new FormControl(this.data.verse, [Validators.required]);

  errorMatcher = new ErrorStateMatcher();

  onNoClick(): void {
    this.dialogRef.close();
  }

}