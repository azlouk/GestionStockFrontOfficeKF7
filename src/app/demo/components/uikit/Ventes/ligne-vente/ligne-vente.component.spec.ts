import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneVenteComponent } from './ligne-vente.component';

describe('LigneVenteComponent', () => {
  let component: LigneVenteComponent;
  let fixture: ComponentFixture<LigneVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigneVenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LigneVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
