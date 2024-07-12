import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneFactureComponent } from './ligne-facture.component';

describe('LigneFactureComponent', () => {
  let component: LigneFactureComponent;
  let fixture: ComponentFixture<LigneFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigneFactureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LigneFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
