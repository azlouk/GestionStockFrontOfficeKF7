import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureAchatDetailsComponent } from './facture-achat-details.component';

describe('FactureAchatDetailsComponent', () => {
  let component: FactureAchatDetailsComponent;
  let fixture: ComponentFixture<FactureAchatDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureAchatDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactureAchatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
