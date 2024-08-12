import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClotureComponent } from './cloture.component';

describe('ClotureComponent', () => {
  let component: ClotureComponent;
  let fixture: ComponentFixture<ClotureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClotureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClotureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
