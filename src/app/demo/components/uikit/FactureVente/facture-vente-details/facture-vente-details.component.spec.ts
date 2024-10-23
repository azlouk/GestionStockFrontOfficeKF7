import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureVenteDetailsComponent } from './facture-vente-details.component';

describe('FactureVenteDetailsComponent', () => {
  let component: FactureVenteDetailsComponent;
  let fixture: ComponentFixture<FactureVenteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureVenteDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactureVenteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
