import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationqrComponent } from './generationqr.component';

describe('GenerationqrComponent', () => {
  let component: GenerationqrComponent;
  let fixture: ComponentFixture<GenerationqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationqrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerationqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
