import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationcodeComponent } from './generationcode.component';

describe('GenerationcodeComponent', () => {
  let component: GenerationcodeComponent;
  let fixture: ComponentFixture<GenerationcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerationcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
