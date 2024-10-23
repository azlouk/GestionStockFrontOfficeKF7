import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureVenteAjoutComponent } from './facture-vente-ajout.component';

describe('FactureVenteAjoutComponent', () => {
  let component: FactureVenteAjoutComponent;
  let fixture: ComponentFixture<FactureVenteAjoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureVenteAjoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactureVenteAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
