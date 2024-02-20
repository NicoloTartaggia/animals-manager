import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnimalDialogComponent } from './create-animal-dialog.component';

describe('CreateAnimalDialogComponent', () => {
  let component: CreateAnimalDialogComponent;
  let fixture: ComponentFixture<CreateAnimalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAnimalDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAnimalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
